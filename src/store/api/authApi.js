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
     * Request password reset email
     * POST /method/frappe.core.doctype.user.user.reset_password
     */
    resetPassword: builder.mutation({
      query: (email) => ({
        url: '/method/frappe.core.doctype.user.user.reset_password',
        method: 'POST',
        body: { user: email },
        credentials: 'include',
      }),
    }),

    /**
     * Set new password using reset key (from welcome email link)
     * POST /method/frappe.core.doctype.user.user.update_password
     */
    updatePassword: builder.mutation({
      query: ({ key, new_password, logout_all_sessions = 0 }) => ({
        url: '/method/frappe.core.doctype.user.user.update_password',
        method: 'POST',
        body: { key, new_password, logout_all_sessions },
        credentials: 'include',
      }),
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
  useResetPasswordMutation,
  useUpdatePasswordMutation,
} = authApi;
