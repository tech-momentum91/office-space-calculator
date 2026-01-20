import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getModulePermissions } from '@/utils/permission-utils';

/**
 * HOC to check if user has access to a specific module
 *
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {string} moduleName - Module name to check permissions for
 * @returns {React.Component} - Component with permission checks
 */
const WithModulePermission = (WrappedComponent, moduleName) => {
  const ComponentWithPermission = (props) => {
    const userPermissions = useSelector((state) => state.auth.userPermissions);

    const isPermissionsLoaded = userPermissions?.data?.message?.role !== undefined;

    const modulePermissions = useMemo(() => {
      if (!isPermissionsLoaded) return null;
      return getModulePermissions(userPermissions, moduleName);
    }, [userPermissions, isPermissionsLoaded]);

    // Loading state while permissions are being fetched
    if (!isPermissionsLoaded) {
      return (
        <div className='flex items-center justify-center h-full min-h-screen'>
          <div className='flex flex-col items-center gap-4'>
            <div className='w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin' />
            <p className='text-neutral-600'>Loading permissions...</p>
          </div>
        </div>
      );
    }

    // Access denied if no permissions for the module
    if (!modulePermissions) {
      return (
        <div className='flex items-center justify-center h-full min-h-screen px-8'>
          <div className='flex flex-col items-center gap-6 max-w-md text-center'>
            <div className='p-4 rounded-full bg-error-light'>
              <svg
                className='w-12 h-12 text-error'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>
            <div className='flex flex-col gap-2'>
              <h1 className='text-2xl font-semibold text-neutral-900'>Access Denied</h1>
              <p className='text-neutral-600'>
                You don&apos;t have permission to access this page. Please contact your
                administrator if you believe this is an error.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging
  ComponentWithPermission.displayName = `WithModulePermission(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithPermission;
};

export default WithModulePermission;
