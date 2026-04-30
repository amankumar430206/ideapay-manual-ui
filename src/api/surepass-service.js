import axios from "axios";
import { BASE_URL } from "./baseUrls";

import {
  InterceptorResponseErrorHandler,
  InterceptorResponseHandler,
} from "./InterceptorHandler";
import { API_URL } from "./urlMetaData";

// get region value from local storage
const Service = axios.create({ baseURL: BASE_URL.API_SUREPASS });

// Service Interceptors Configuration
Service.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${process.env.REACT_APP_API_SUREPASS_TOKEN}`;
  req.headers["Content-Type"] = "application/x-www-form-urlencoded";

  return req;
});

Service.interceptors.response.use(
  (res) => {
    InterceptorResponseHandler(res);
    return res;
  },
  (error) => {
    InterceptorResponseErrorHandler(error);
    return error;
  }
);

export const VerifyPassport = async (payload) => {
  const res = await Service.post(API_URL.SUREPASS_VERIFY_PASSPORT, payload);
  return res.data;
};
export default Service;
