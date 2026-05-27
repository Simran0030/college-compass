/** TREAT AS IMMUTABLE - This file is protected by the file-edit tool
 *
 * Database connection setup using Drizzle ORM with MySQL2
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { getDatabaseCredentials } from './config';
import * as schema from './schema';

let poolConnection: mysql.Pool | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;
let dbError: Error | null = null;

// Try to get database configuration
try {
  const dbConfig = getDatabaseCredentials();

  // Create MySQL connection pool with SSL enabled
  poolConnection = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    ssl: {
      rejectUnauthorized: false,
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Create Drizzle instance
  dbInstance = drizzle(poolConnection, { schema, mode: 'default' });
} catch (error) {
  // Store error but don't fail - database is optional for some deployments
  dbError = error instanceof Error ? error : new Error(String(error));
}

// Export database with lazy error throwing
export const db = new Proxy(dbInstance || {}, {
  get: (target, prop) => {
    if (dbError && dbInstance === null) {
      throw new Error(
        `Database is not available: ${dbError.message}. ` +
        `Please configure the database config file or set DATABASE_URL environment variable.`
      );
    }
    return (dbInstance as any)?.[prop];
  },
});

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    if (!poolConnection) {
      return false;
    }
    const connection = await poolConnection.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch {
    return false;
  }
}

/**
 * Close database connection pool
 */
export async function closeConnection(): Promise<void> {
  if (poolConnection) {
    await poolConnection.end();
  }
}
