/**
 * Centralized error logging utility
 * Logs errors differently in development vs production
 */

import { isDevelopment, isProduction } from './env-validation';

/**
 * Log error to console and/or error tracking service
 * @param {Error} error - The error object
 * @param {Object} errorInfo - Additional error information (e.g., componentStack)
 * @param {Object} context - Context information (user, route, etc.)
 */
export function logError(error, errorInfo = {}, context = {}) {
  // Build error report
  const errorReport = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...context,
    ...errorInfo,
  };

  if (isDevelopment()) {
    // Development: Log to console with full details
    console.group('🚨 Error Logged');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Context:', context);
    console.error('Full Report:', errorReport);
    console.groupEnd();
  }

  if (isProduction()) {
    // Production: Send to error tracking service (e.g., Sentry)
    // TODO: Integrate with Sentry or other error tracking service
    // Example:
    // Sentry.captureException(error, {
    //   contexts: { errorInfo, context },
    // });

    console.error('Error occurred:', error.message);
  }

  // Return error report for potential further processing
  return errorReport;
}

/**
 * Log warning to console
 * @param {string} message - Warning message
 * @param {Object} data - Additional data
 */
export function logWarning(message, data = {}) {
  if (isDevelopment()) {
    console.warn('⚠️ Warning:', message, data);
  }
}

/**
 * Log info message
 * @param {string} message - Info message
 * @param {Object} data - Additional data
 */
export function logInfo(message, data = {}) {
  if (isDevelopment()) {
    console.info('ℹ️ Info:', message, data);
  }
}
