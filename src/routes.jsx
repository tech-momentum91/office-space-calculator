import { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import RouteErrorBoundary from '@/components/error-boundaries/RouteErrorBoundary';
import PageLoader from '@/components/loaders/PageLoader';
import { lazyLoad } from '@/utils/lazy-load';

// Lazy load pages for better performance
const WelcomePage = lazyLoad(() => import('@/pages/WelcomePage'));
const LoginPage = lazyLoad(() => import('@/pages/auth/LoginPage'));
const DashboardPage = lazyLoad(() => import('@/pages/DashboardPage'));
const OfficeSpaceCalculatorPage = lazyLoad(() => import('@/pages/OfficeSpaceCalculatorPage'));
const DetailsSpaceAnalysisPage = lazyLoad(() => import('@/pages/DetailsSpaceAnalysisPage'));

/**
 * Application routes configuration
 *
 * Route structure:
 * - / → RootRedirect (redirects based on auth status)
 * - /welcome → Public landing page (non-protected)
 * - /calculator → Office Space Calculator (non-protected)
 * - /login → LoginPage (ProtectedRoute with requireAuth=false)
 * - /dashboard → Dashboard (ProtectedRoute)
 * - * → 404 redirect
 */
const routes = [
  {
    path: '/',
    element: (
      <RouteErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <WelcomePage />
        </Suspense>
      </RouteErrorBoundary>
    ),
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
        <Suspense fallback={<PageLoader />}>
          <LoginPage />
        </Suspense>
      </RouteErrorBoundary>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <RouteErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <DashboardPage />
        </Suspense>
      </RouteErrorBoundary>
    ),
  },

  {
    path: '/calculator',
    element: (
      <RouteErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <OfficeSpaceCalculatorPage />
        </Suspense>
      </RouteErrorBoundary>
    ),
  },
  {
    path: '/details-space-analysis/:reportId?',
    element: (
      <RouteErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <DetailsSpaceAnalysisPage />
        </Suspense>
      </RouteErrorBoundary>
    ),
  },
  {
    path: '*',
    element: <Navigate to='/' replace />,
  },
];

export default routes;
