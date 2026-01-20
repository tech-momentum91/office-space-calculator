/**
 * Permission utility functions
 */

/**
 * Gets the user role object from userPermissions data
 * @param {Object} userPermissions - The userPermissions object from Redux state
 * @returns {Object|null} - The role object for the first role key, or null if not found
 *
 * @example
 * const userPermissions = useSelector((state) => state.auth.userPermissions);
 * const userRole = getUserRole(userPermissions);
 */
export const getUserRole = (userPermissions) => {
  if (!userPermissions?.data?.message?.role) return null;

  const roleKeys = Object.keys(userPermissions.data.message.role);
  if (roleKeys.length === 0) return null;

  // Get the first role key and return its value
  const firstRoleKey = roleKeys[0];
  return userPermissions.data.message.role[firstRoleKey];
};

/**
 * Gets the role key (e.g., "Super Admin") from userPermissions data
 * @param {Object} userPermissions - The userPermissions object from Redux state
 * @returns {string|null} - The first role key, or null if not found
 *
 * @example
 * const userPermissions = useSelector((state) => state.auth.userPermissions);
 * const roleKey = getUserRoleKey(userPermissions);
 * // roleKey will be "Super Admin" or whatever the first role is
 */
export const getUserRoleKey = (userPermissions) => {
  if (!userPermissions?.data?.message?.role) return null;

  const roleKeys = Object.keys(userPermissions.data.message.role);
  return roleKeys.length > 0 ? roleKeys[0] : null;
};

/**
 * Gets the module permissions for a specific module from userPermissions data
 * @param {Object} userPermissions - The userPermissions object from Redux state
 * @param {string} moduleName - The name of the module (e.g., "Calculator", "Settings")
 * @returns {Object|null} - The module permissions object with read, write, delete, create, etc.
 *
 * @example
 * const userPermissions = useSelector((state) => state.auth.userPermissions);
 * const calcPermissions = getModulePermissions(userPermissions, "Calculator");
 * // calcPermissions: { read: true, write: true, delete: false, create: true, ... }
 */
export const getModulePermissions = (userPermissions, moduleName) => {
  if (!userPermissions?.data?.message?.role || !moduleName) return null;

  const roleKeys = Object.keys(userPermissions.data.message.role);
  if (roleKeys.length === 0) return null;

  // Get the first role (primary role)
  const firstRoleKey = roleKeys[0];
  const role = userPermissions.data.message.role[firstRoleKey];

  // Check if the module exists in this role
  if (!role || !role[moduleName]) return null;

  return role[moduleName];
};

/**
 * Checks if a specific permission is allowed for a module
 * @param {Object} userPermissions - The userPermissions object from Redux state
 * @param {string} moduleName - The name of the module (e.g., "Calculator", "Settings")
 * @param {string} permission - The permission to check (e.g., "read", "write", "delete", "create")
 * @returns {boolean} - true if the permission is allowed, false otherwise
 *
 * @example
 * const userPermissions = useSelector((state) => state.auth.userPermissions);
 * const canCreate = hasModulePermission(userPermissions, "Calculator", "create");
 * const canDelete = hasModulePermission(userPermissions, "Calculator", "delete");
 */
export const hasModulePermission = (userPermissions, moduleName, permission) => {
  const modulePermissions = getModulePermissions(userPermissions, moduleName);
  if (!modulePermissions) return false;

  return modulePermissions[permission] === true;
};

/**
 * Gets the sidebar menu items for the user
 * @param {Object} userPermissions - The userPermissions object from Redux state
 * @returns {Array<string>} - Array of sidebar menu items
 *
 * @example
 * const userPermissions = useSelector((state) => state.auth.userPermissions);
 * const sidebarItems = getSidebarItems(userPermissions);
 * // sidebarItems: ["Dashboard", "Calculator", "Settings"]
 */
export const getSidebarItems = (userPermissions) => {
  if (!userPermissions?.data?.message?.sidebar) return [];
  return userPermissions.data.message.sidebar;
};
