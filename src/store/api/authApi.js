import { baseApi } from './baseApi';

/**
 * Auth API endpoints injected into the base API
 * Handles login, logout, and session management
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Login mutation
     * POST /method/login
     */
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/method/login',
        method: 'POST',
        body: { usr: email, pwd: password },
        credentials: 'include',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    /**
     * Logout query
     * GET /method/logout
     */
    logout: builder.mutation({
      query: () => ({
        url: '/method/logout',
        method: 'GET',
        credentials: 'include',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    /**
     * Get current session
     * GET /method/frappe.auth.get_logged_user
     */
    getSession: builder.query({
      query: () => ({
        url: '/method/frappe.auth.get_logged_user',
        credentials: 'include',
      }),
      providesTags: ['Auth'],
      // Transform response to normalize data
      transformResponse: (response) => {
        if (response && response.message && response.message !== 'Guest') {
          return { email: response.message, isAuthenticated: true };
        }
        return { email: null, isAuthenticated: false };
      },
    }),

    /**
     * Get user by email
     * GET /resource/User/{email}
     */
    getUserByEmail: builder.query({
      query: (email) => ({
        url: `/resource/User/${email}`,
        credentials: 'include',
      }),
      providesTags: (result, error, email) => [{ type: 'User', id: email }],
      // Transform response to normalize user data
      transformResponse: (response) => {
        const userData = response?.data || response;
        return {
          full_name: userData.full_name || userData.fullname || userData.name || '',
          email: userData.email || userData.name || '',
          user_image: userData.user_image || userData.avatar || null,
        };
      },
    }),
  }),
  overrideExisting: false,
});

/**
 * Export hooks for usage in components
 */
export const {
  useLoginMutation,
  useLogoutMutation,
  useGetSessionQuery,
  useLazyGetSessionQuery,
  useGetUserByEmailQuery,
  useLazyGetUserByEmailQuery,
} = authApi;
