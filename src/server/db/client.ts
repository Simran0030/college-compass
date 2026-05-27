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
  dbInstance = drizzle(poolConnection as any, { schema, mode: 'default' });
} catch {
  // Store error but don't fail - database is optional for some deployments
  // Error will be thrown when database is actually used
}

// Export database instance (or empty object if not available)
export const db = (dbInstance || {}) as unknown as ReturnType<typeof drizzle>;

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
