import { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/route-protection/ProtectedRoute';
import RootRedirect from '@/components/route-protection/RootRedirect';
import RouteErrorBoundary from '@/components/error-boundaries/RouteErrorBoundary';
import PageLoader from '@/components/loaders/PageLoader';
import { lazyLoad } from '@/utils/lazy-load';

// Lazy load pages for better performance
const WelcomePage = lazyLoad(() => import('@/pages/WelcomePage'));
const LoginPage = lazyLoad(() => import('@/pages/auth/LoginPage'));
const DashboardPage = lazyLoad(() => import('@/pages/DashboardPage'));

/**
 * Application routes configuration
 *
 * Route structure:
 * - / → RootRedirect (redirects based on auth status)
 * - /welcome → Public landing page (non-protected)
 * - /login → LoginPage (ProtectedRoute with requireAuth=false)
 * - /dashboard → Dashboard (ProtectedRoute)
 * - * → 404 redirect
 */
const routes = [
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/welcome',
    element: (
      <RouteErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <WelcomePage />
        </Suspense>
      </RouteErrorBoundary>
    ),
  },
  {
    path: '/login',
    element: (
      <RouteErrorBoundary>
        <ProtectedRoute requireAuth={false}>
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        </ProtectedRoute>
      </RouteErrorBoundary>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <RouteErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        </ProtectedRoute>
      </RouteErrorBoundary>
    ),
  },
  {
    path: '*',
    element: <Navigate to='/' replace />,
  },
];

export default routes;
