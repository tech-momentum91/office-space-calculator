import { useSelector, useDispatch } from 'react-redux';
import { loginAsync, logoutAsync, checkSession } from '@/store/slices/authSlice';

/**
 * Custom hook for auth state and actions
 * Convenience hook to access auth state and dispatch auth actions
 *
 * @returns {Object} Auth state and methods
 */
export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    sessionChecked: auth.sessionChecked,
    sessionApiError: auth.sessionApiError,
    userPermissions: auth.userPermissions,
    error: auth.error,
    login: (email, password) => dispatch(loginAsync({ email, password })),
    logout: () => dispatch(logoutAsync()),
    refreshSession: () => dispatch(checkSession()),
  };
}
