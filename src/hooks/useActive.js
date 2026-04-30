import { useLocation } from "react-router-dom";

export const useActive = () => {
  const location = useLocation();
  const isActive = (path) => {
    if (!path) return false;
    return location?.pathname.includes(path);
  };
  return {
    isActive,
  };
};
