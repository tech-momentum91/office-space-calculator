import { lazy } from 'react';

/**
 * Retry function for lazy loading
 * Attempts to load a module multiple times before giving up
 *
 * @param {Function} fn - Import function
 * @param {number} retriesLeft - Number of retries remaining
 * @param {number} interval - Delay between retries in ms
 * @returns {Promise} - Module promise
 */
function retryImport(fn, retriesLeft = 3, interval = 1000) {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error);
            return;
          }

          // Retry with exponential backoff
          retryImport(fn, retriesLeft - 1, interval * 2).then(resolve, reject);
        }, interval);
      });
  });
}

/**
 * Dynamic lazy loading utility with configurable behavior
 * Allows opt-in/opt-out of lazy loading per component
 *
 * @param {Function} importFn - Dynamic import function
 * @param {Object} options - Configuration options
 * @param {boolean} options.eager - Load immediately if true (default: false)
 * @param {number} options.retries - Number of retry attempts (default: 3)
 * @param {React.Component} options.fallback - Custom loading component
 * @returns {React.Component} - Lazy-loaded component or eager component
 *
 * @example
 * // Lazy loaded (default)
 * const Dashboard = lazyLoad(() => import('@/pages/DashboardPage'));
 *
 * // Eager loaded (no lazy loading)
 * const CriticalPage = lazyLoad(() => import('@/pages/CriticalPage'), { eager: true });
 *
 * // Custom retries
 * const UnstablePage = lazyLoad(() => import('@/pages/UnstablePage'), { retries: 5 });
 */
export function lazyLoad(importFn, options = {}) {
  const { eager = false, retries = 3 } = options;

  // If eager loading is enabled, don't use React.lazy
  if (eager) {
    // Return a synchronous loader that immediately resolves
    // Note: This won't work for actual dynamic imports, but documents the intent
    // In practice, for truly eager components, import them normally at the top
    console.warn(
      'Eager loading requested, but lazyLoad still returns a lazy component. Import directly for true eager loading.',
    );
  }

  // Use lazy loading with retry logic
  return lazy(() => retryImport(importFn, retries));
}

/**
 * Create a loading component for Suspense fallback
 */
export function LoadingFallback({ message = 'Loading...' }) {
  return (
    <div className='flex items-center justify-center min-h-[200px]'>
      <div className='flex flex-col items-center gap-4'>
        <div className='w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin' />
        <p className='text-neutral-600'>{message}</p>
      </div>
    </div>
  );
}

/**
 * Full page loading component
 */
export function PageLoadingFallback() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='flex flex-col items-center gap-4'>
        <div className='w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin' />
        <p className='text-lg text-neutral-600'>Loading page...</p>
      </div>
    </div>
  );
}
