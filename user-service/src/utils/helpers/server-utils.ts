/**
 * Server utility functions for environment variable management
 */

/**
 * Get a required environment variable
 * @param key - The environment variable key
 * @returns The environment variable value
 * @throws Error if the environment variable is not set
 */
export const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} environment variable is required`);
  }
  return value;
};

/**
 * Get an optional environment variable with a default value
 * @param key - The environment variable key
 * @param defaultValue - The default value if the environment variable is not set
 * @returns The environment variable value or the default value
 */
export const getOptionalEnv = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

/**
 * Get an optional environment variable as a number with a default value
 * @param key - The environment variable key
 * @param defaultValue - The default value if the environment variable is not set
 * @returns The environment variable value as a number or the default value
 */
export const getOptionalNumberEnv = (
  key: string,
  defaultValue: number
): number => {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};
