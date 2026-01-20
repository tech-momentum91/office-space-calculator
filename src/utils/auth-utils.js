/**
 * Utility functions for handling authentication errors and session management
 */

// Public routes that should be accessible without authentication
const PUBLIC_ROUTES = ['/login', '/reset-password', '/welcome', '/'];

/**
 * Clears all authentication data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem('email');
  localStorage.removeItem('user');
  localStorage.removeItem('user_perm_sidebar');
  localStorage.removeItem('authToken');
};

/**
 * Redirects user to login page
 * Prevents redirect if already on a public route to avoid infinite loops
 */
export const redirectToLogin = () => {
  const currentPath = window.location.pathname;
  // Don't redirect if already on a public route to prevent infinite loops
  if (PUBLIC_ROUTES.includes(currentPath)) {
    return;
  }
  // Use window.location.href for a full page reload to reset all state
  window.location.href = '/login';
};

/**
 * Handles authentication errors (401, 403) by clearing data and redirecting
 * @param {Object} error - The error object from API
 * @returns {boolean} - True if the error was handled
 */
export const handleAuthError = (error) => {
  const status = error?.status || error?.response?.status;

  if (status === 401 || status === 403) {
    console.log('Authentication failed. Session may have expired.');
    clearAuthData();
    redirectToLogin();
    return true; // Indicates that the error was handled
  }

  return false; // Error was not handled
};

/**
 * Checks if an error is an authentication error
 * @param {Object} error - The error object from API
 * @returns {boolean} - True if it's an auth error
 */
export const isAuthError = (error) => {
  const status = error?.status || error?.response?.status;
  return status === 401 || status === 403;
};

/**
 * Gets user data from localStorage
 * @returns {Object|null} - User data or null
 */
export const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    return null;
  }
};

/**
 * Gets email from localStorage
 * @returns {string|null} - Email or null
 */
export const getEmailFromStorage = () => {
  return localStorage.getItem('email');
};
