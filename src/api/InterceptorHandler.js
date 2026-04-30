import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { AUTHORIZATION } from "../consts/AppContants";

export const AUTH_LOCAL_VARIABLES = {
  auth_token: "mnt-auth-token",
};

const ERROR_STATUS = {
  ERR_BAD_REQUEST: "ERR_BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  EXPECTATION_FAILED: "EXPECTATION_FAILED",
};

// Request Interceptor Handler
export const InterceptorRequestHandler = (req) => {
  if (!navigator.onLine) {
    toast("Please Check Internet Connection..", {
      type: "error",
      theme: "colored",
    });
    return;
  }

  req.headers[AUTHORIZATION] = secureLocalStorage.getItem(
    AUTH_LOCAL_VARIABLES.auth_token
  );
  return req;
};

// Response Interceptor Handler
export const InterceptorResponseHandler = (res) => {
  if (res.headers[AUTH_LOCAL_VARIABLES.auth_token]) {
    secureLocalStorage.setItem(
      AUTH_LOCAL_VARIABLES.auth_token,
      res.headers[AUTH_LOCAL_VARIABLES.auth_token]
    );
  }

  if (res.status === 200) {
    toast(res.data?.msg, {
      type: "success",
    });
  }
};

export const InterceptorResponseErrorHandler = (error) => {
  // check for network error
  if (error?.code === "ERR_NETWORK") {
    toast(error?.message, {
      type: "error",
      theme: "colored",
    });
  }

  // check for response error
  if (error.response) {
    toast(error.response?.data?.error?.msg || error.response?.data?.msg, {
      type: "error",
    });
  }
};
