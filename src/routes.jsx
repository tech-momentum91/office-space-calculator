import { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import RouteErrorBoundary from '@/components/error-boundaries/RouteErrorBoundary';
import PageLoader from '@/components/loaders/PageLoader';
import { lazyLoad } from '@/utils/lazy-load';

const OfficeSpaceCalculatorPage = lazyLoad(() => import('@/pages/OfficeSpaceCalculatorPage'));

/**
 * Single-page lead magnet routes:
 * - / → Office Space Calculator
 * - * → redirect to /
 */
const routes = [
  {
    path: '/',
    element: (
      <RouteErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <OfficeSpaceCalculatorPage />
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
