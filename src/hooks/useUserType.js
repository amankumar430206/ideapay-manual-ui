import { useSelector } from "react-redux";
import { ROLES } from "../consts/AppRoles";

/**
 *
 * @param {string} role - user role
 */
export const useUserType = (role = "") => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  return {
    isSuperAdmin: currentUser?.role === ROLES.SUPER,
    isAdmin: currentUser?.role === ROLES.ADMIN,
    isClient: currentUser?.role === ROLES.CLIENT,
    isUser: currentUser?.role === ROLES.USER,
    isCompliance: currentUser?.role === ROLES.COMPLIANCE,
    isController: currentUser?.role === ROLES.CONTROLLER,
    isAccountant: currentUser?.role === ROLES.ACCOUNTANT,
  };
};
