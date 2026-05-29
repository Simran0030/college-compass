/**
 * Simple wrapper around environment variables for secrets management.
 * Replace with a secure secrets provider if needed (Vault, AWS Secrets Manager, etc.).
 */
export function getSecret(key: string): string | undefined {
  return process.env[key];
}

export default {
  getSecret,
};
