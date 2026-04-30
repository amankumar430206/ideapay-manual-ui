import { ROLES } from "../consts/AppRoles";

import { usePermission } from "../hooks/usePermission";

// Allowing fro mulitiple users at a time
export const OnlyFor = ({ roles = [], role = "", children }) => {
  const isAllowed = usePermission(roles);
  if (isAllowed) return <>{children}</>;
};

export const OnlyForUser = ({ role = "", children }) => {
  if (ROLES[role] === ROLES.USER) return <>{children}</>;
};

export const OnlyForAdmin = ({ role = "", children }) => {
  if (ROLES[role] === ROLES.ADMIN) return <>{children}</>;
};

// Allowing fro mulitiple users at a time
export const permitUser = (roles = [], role = "") => {
  return roles.includes(role);
};
