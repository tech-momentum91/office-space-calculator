/**
 * Environment Variable Validation Utility
 * Validates required environment variables on app startup
 */

const requiredEnvVariables = ['PHI_ENV'];

const optionalEnvVariables = ['PHI_ENABLE_ANALYTICS', 'PHI_ENABLE_ERROR_TRACKING', 'PHI_API_URL'];

/**
 * Validates all required environment variables are present
 * @throws {Error} If any required environment variable is missing
 */
export function validateEnv() {
  const missing = [];

  for (const envVariable of requiredEnvVariables) {
    if (!import.meta.env[envVariable]) {
      missing.push(envVariable);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\nPlease check your .env file.`,
    );
  }

  // Log environment info in development
  if (import.meta.env.DEV) {
    console.log('✅ Environment variables validated successfully');
    console.log('📝 Environment:', import.meta.env.PHI_ENV);
    console.log('🌐 API URL:', import.meta.env.PHI_API_URL);
  }
}

/**
 * Gets an environment variable with type checking
 * @param {string} key - Environment variable key
 * @param {*} defaultValue - Default value if not set
 * @returns {string} The environment variable value
 */
export function getEnv(key, defaultValue = '') {
  return import.meta.env[key] || defaultValue;
}

/**
 * Check if running in production
 * @returns {boolean}
 */
export function isProduction() {
  return import.meta.env.PROD;
}

/**
 * Check if running in development
 * @returns {boolean}
 */
export function isDevelopment() {
  return import.meta.env.DEV;
}

/**
 * Get API base URL
 * @returns {string}
 */
export function getApiUrl() {
  return import.meta.env.PHI_API_URL;
}
