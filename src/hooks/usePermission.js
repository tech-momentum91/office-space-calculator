import { useSelector } from 'react-redux';
import { hasModulePermission, getModulePermissions } from '@/utils/permission-utils';

/**
 * Custom hook to check permissions easily
 *
 * @param {string} moduleName - Module name to check permissions for
 * @param {string} permission - Specific permission to check (read, write, delete, create, etc.)
 * @returns {boolean} - True if user has the permission
 *
 * @example
 * const canEdit = usePermission('Calculator', 'write');
 * const canDelete = usePermission('Calculator', 'delete');
 */
export function usePermission(moduleName, permission) {
  const userPermissions = useSelector((state) => state.auth.userPermissions);
  return hasModulePermission(userPermissions, moduleName, permission);
}

/**
 * Custom hook to get all permissions for a module
 *
 * @param {string} moduleName - Module name
 * @returns {Object|null} - Module permissions object or null
 *
 * @example
 * const permissions = useModulePermissions('Calculator');
 * // permissions: { read: true, write: true, delete: false, ... }
 */
export function useModulePermissions(moduleName) {
  const userPermissions = useSelector((state) => state.auth.userPermissions);
  return getModulePermissions(userPermissions, moduleName);
}
