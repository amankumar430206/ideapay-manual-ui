import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { usePermission } from "../../hooks/usePermission";
import { ROUTES } from "../../router/routes";

const PrivateRoute = ({ allowedRoles = [], children }) => {
  const isAllowed = usePermission(allowedRoles);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAllowed) {
      toast("Not Authorzied User!", {
        theme: "colored",
        type: "error",
      });

      // strict route to login, there are no routes available for the user
      navigate(ROUTES.AUTH.LOGIN);
    }
  });

  return <>{children}</>;
};

export default PrivateRoute;
