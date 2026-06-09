import { useSelector } from "react-redux";
import { ROLES } from "../consts/AppRoles";

/**
 * Returns a `can(permissionId)` checker for the current user.
 *
 * Rules:
 * - SUPER always has full access (bypass).
 * - If the role has no saved permission document yet (`configured === false`),
 *   the app stays permissive so existing flows keep working until an admin
 *   sets permissions up. Enforcement turns strict once a role is configured.
 * - Otherwise the permission id must be present in the user's permission list.
 */
export const useCan = () => {
  const role = useSelector((state) => state.auth.currentUser?.role);
  const permissions = useSelector((state) => state.auth.permissions);
  const configured = useSelector((state) => state.auth.permissionsConfigured);

  return (permissionId) => {
    if (role === ROLES.SUPER) return true;
    if (!configured) return true; // legacy-permissive until configured
    if (!permissionId) return true;
    return Array.isArray(permissions) && permissions.includes(permissionId);
  };
};
