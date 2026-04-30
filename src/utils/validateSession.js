import { AUTH_LOCAL_VARIABLES } from "../store/features/authSlice";

export const validateSession = () => {
  const isSession = sessionStorage.getItem(AUTH_LOCAL_VARIABLES.session_token);
  if (!isSession) return;
};
