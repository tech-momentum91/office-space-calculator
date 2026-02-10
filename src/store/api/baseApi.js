import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { getApiUrl } from '@/utils/env-validation';
import { logoutSuccess } from '../slices/authSlice';

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/login',
  '/reset-password',
  '/email-sent',
  '/set-password',
  '/welcome',
  '/details-space-analysis',
  '/details-space-analysis/:reportId',
  '/calculator',
];

/**
 * Base query with credentials for cookie-based authentication
 */
const baseQuery = fetchBaseQuery({
  baseUrl: `${getApiUrl()}/api`,
  credentials: 'include', // Include cookies for session-based auth
  prepareHeaders: (headers) => {
    // Ensure Content-Type is set for JSON requests
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return headers;
  },
});

/**
 * Base query with automatic re-authentication
 * Handles 401/403 errors by logging out user and redirecting
 */
const baseQueryWithReauth = async (args, api, extraOptions) => {
  console.log('args', args);
  console.log('api', api);
  console.log('extraOptions', extraOptions);
  const result = await baseQuery(args, api, extraOptions);

  // Handle authentication errors (401/403)
  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    const currentPath = window.location.pathname;
    const isPublicRoute = PUBLIC_ROUTES.includes(currentPath);
    const isLoginEndpoint = args.url?.includes('/method/login');
    const isSessionCheck = args.url?.includes('/method/frappe.auth.get_logged_user');
    console.log('currentPath', currentPath);
    console.log('isPublicRoute', isPublicRoute);
    console.log('isLoginEndpoint', isLoginEndpoint);
    console.log('isSessionCheck', isSessionCheck);
    // Don't handle auth errors for login endpoint or public routes
    if (!isLoginEndpoint && !isPublicRoute && !isSessionCheck) {
      console.warn('Authentication failed. Logging out user.');

      // Dispatch logout action
      api.dispatch(logoutSuccess());

      // Redirect to login
      // if (typeof window !== 'undefined') {
      //   window.location.href = '/login';
      // }
    }
  }

  // Handle 500 errors
  if (result.error && result.error.status === 500) {
    console.error('Server error:', result.error);
  }

  return result;
};

/**
 * Base query with retry logic for network errors
 */
const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 1 });

/**
 * Base API slice for RTK Query
 * All API endpoints should be injected into this base API
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  // Tag types for cache invalidation
  tagTypes: ['Auth', 'User', 'Permissions'],
  // API endpoints will be injected in separate files
  endpoints: () => ({}),
});

/**
 * Export hooks for usage in components
 */
export const { usePrefetch } = baseApi;
