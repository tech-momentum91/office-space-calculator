import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkSession } from '@/store/slices/authSlice';

/**
 * RootRedirect component
 * Handles the root route (/) and redirects based on authentication status
 * - If authenticated → redirect to /dashboard
 * - If not authenticated → redirect to /welcome
 */
export default function RootRedirect() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, sessionChecked } = useSelector((state) => state.auth);

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
          <p className='text-neutral-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if authenticated, otherwise to welcome page
  return isAuthenticated ? (
    <Navigate to='/dashboard' replace />
  ) : (
    <Navigate to='/welcome' replace />
  );
}
