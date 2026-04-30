import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../store/features/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ROUTES } from "../router/routes";

export const AuthGuard = ({ children }) => {
  const currentUser = useSelector((s) => s.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      dispatch(clearAuth());
      toast("UnAuthorized Access", {
        type: "error",
      });
      return navigate(ROUTES.AUTH.LOGIN);
    }
  }, []);
  return <>{children}</>;
};
