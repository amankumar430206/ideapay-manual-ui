import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { Spinner } from "../../components/spinner";
import { ROUTES } from "../../router/routes";
import { clearAuth } from "../../store/features/authSlice";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(clearAuth());
      navigate(ROUTES.AUTH.LOGIN, {
        replace: true,
      });
    }, 1000);
  }, []);

  return (
    <div className={"h-100"}>
      <Spinner text={"Logging Out.."} />
    </div>
  );
};

export default Logout;
