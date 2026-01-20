import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkSession } from '@/store/slices/authSlice';

/**
 * ProtectedRoute component for handling route authentication
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authorized
 * @param {boolean} [props.requireAuth=true] - Whether the route requires authentication
 *
 * Features:
 * - Checks session on mount using Redux thunk
 * - Shows loading state while verifying authentication
 * - Redirects to /login if auth required but user not authenticated
 * - Shows error message if session API fails on protected pages
 * - Redirects to /dashboard if user authenticated but trying to access login
 */
export default function ProtectedRoute({ children, requireAuth = true }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, loading, sessionChecked, sessionApiError } = useSelector(
    (state) => state.auth,
  );

  // Trigger session check when component mounts
  useEffect(() => {
    if (!sessionChecked) {
      dispatch(checkSession());
    }
  }, [dispatch, sessionChecked]);

  // Show loader while checking authentication
  if (loading || !sessionChecked) {
    return (
      <div className='h-screen w-full flex items-center justify-center bg-neutral-50'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin' />
          <p className='text-neutral-600'>Verifying session...</p>
        </div>
      </div>
    );
  }

  // If session API failed on a protected page, show error message
  if (requireAuth && sessionApiError) {
    return (
      <div className='h-screen w-full flex items-center justify-center bg-neutral-50'>
        <div className='flex flex-col items-center gap-4 max-w-md mx-auto px-4 text-center'>
          <div className='text-6xl'>⚠️</div>
          <h1 className='text-2xl font-semibold text-neutral-900'>Something went wrong</h1>
          <p className='text-neutral-600'>
            We couldn&apos;t verify your session. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // If route is login page and user is already authenticated
  if (!requireAuth && isAuthenticated) {
    return <Navigate to='/dashboard' replace />;
  }

  return <>{children}</>;
}
