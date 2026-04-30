import { toast } from "react-toastify";

export const handleError = (error, onError = () => {}) => {
  console.error("ERROR OCCURED", error);
  const message = error?.response?.data?.message;

  // if (status === "INTERNAL_SERVER_ERROR") {
  //   onError();
  // }
  toast(message, {
    type: "error",
  });
};
