/**
 * Simple wrapper around environment variables for secrets management.
 * In production, this could be replaced with a more sophisticated system
 * that retrieves secrets from a vault or secure storage.
 */

export function getSecret(key: string): string | undefined {
  return process.env[key];
}

export default {
  getSecret,
};
