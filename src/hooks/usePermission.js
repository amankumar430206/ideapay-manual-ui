import { useSelector } from "react-redux";
import { permitUser } from "../components/Roles";

export const usePermission = (allowedRoles = []) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  if (permitUser(allowedRoles, currentUser?.role)) return true;
  return false;
};
