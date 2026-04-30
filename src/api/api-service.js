import axios from "axios";
import { BASE_URL } from "./baseUrls";

import {
  InterceptorRequestHandler,
  InterceptorResponseErrorHandler,
  InterceptorResponseHandler,
} from "./InterceptorHandler";
import { API_URL } from "./urlMetaData";

// get region value from local storage
const ApiService = axios.create({ baseURL: BASE_URL.API });

// Service Interceptors Configuration
ApiService.interceptors.request.use((req) => InterceptorRequestHandler(req));

ApiService.interceptors.response.use(
  (res) => {
    InterceptorResponseHandler(res);
    return res;
  },
  (error) => {
    InterceptorResponseErrorHandler(error);
    return error;
  }
);

// Authentication
export const UserLogin = async (payload) => {
  const res = await ApiService.post(API_URL.USER_LOGIN, payload);
  return res.data;
};

export const UserRegister = async (payload) => {
  const res = await ApiService.post(API_URL.USER_REGISTER, payload);
  return res.data;
};

export const UserKYCUpdate = async (payload) => {
  const res = await ApiService.post(API_URL.USERS_KYC_UPDATE, payload);
  return res.data;
};

export const UserSignUp = async (payload) => {
  const res = await ApiService.post(API_URL.USER_SIGNUP, payload);
  return res.data;
};

export const fetchUsers = async ({
  role,
  status,
  client = "",
  isSwift = "",
  searchQuery = "",
}) => {
  const res = await ApiService.get(
    `${API_URL.USERS}?status=${status}&role=${role}&client=${client}&searchQuery=${searchQuery}&isSwift=${isSwift}`
  );
  return res.data;
};

export const fetchUserById = async ({ id, populate = "" }) => {
  const res = await ApiService.get(
    `${API_URL.USERS}/${id}?populate=${populate}`
  );
  return res.data;
};

export const fetchUserAccounts = async ({ id, populate = "" }) => {
  const res = await ApiService.post(`${API_URL.ACCOUNTS_USER}/${id}`, {
    id,
    populate,
  });
  return res.data;
};

export const fetchAccounts = async ({ query, populate = "" }) => {
  const res = await ApiService.post(API_URL.ACCOUNTS, {
    query,
    populate,
  });
  return res.data;
};

export const createAccount = async (payload) => {
  const res = await ApiService.post(API_URL.ACCOUNTS_NEW, payload);
  return res.data;
};

export const fetchAccountById = async (payload) => {
  const res = await ApiService.post(API_URL.USER_LOGIN, payload);
  return res.data;
};

export const UpdateUserStatus = async (payload) => {
  const res = await ApiService.post(`${API_URL.USERS_UPDATE_STATUS}`, payload);
  return res.data;
};

export const UpdateAccBalance = async ({ accountId = "", balance }) => {
  const res = await ApiService.post(`${API_URL.ACCOUNTS_UPDATE_BALANCE}`, {
    accountId,
    balance,
  });
  return res.data;
};

export const fetchAccountStats = async ({ user = "" }) => {
  const res = await ApiService.get(`${API_URL.ACCOUNTS_STATS}?user=${user}`);
  return res.data;
};

export const fetchPoolAccounts = async (payload) => {
  const res = await ApiService.post(`${API_URL.POOL_ACCOUNTS}`, payload);
  return res.data;
};

export const fetchUserStats = async ({ isSwift = false }) => {
  const res = await ApiService.get(`${API_URL.USERS_STATS}?isSwift=${isSwift}`);
  return res.data;
};

export const AuthResetPassword = async (payload) => {
  const res = await ApiService.post(API_URL.USER_RESET_PASS, payload);
  return res.data;
};

export const AuthEmailVerification = async (payload) => {
  const res = await ApiService.post(API_URL.USER_VERIFY_OTP, payload);
  return res.data;
};

// transfer actions
export const TransferBtAccounts = async (payload) => {
  const res = await ApiService.post(API_URL.TRANSFERS_ACC, payload);
  return res.data;
};

export const fetchTransactions = async ({ query = "", populate = "" }) => {
  const res = await ApiService.post(`${API_URL.TRANSACTIONS}`, {
    query,
    populate,
  });
  return res.data;
};

export const UpdateTransactionStatus = async (payload) => {
  const res = await ApiService.post(
    `${API_URL.TRANSACTIONS_UPDATE_STATUS}`,
    payload
  );
  return res.data;
};

export const ApproveAccountTransaction = async (payload) => {
  const res = await ApiService.post(
    `${API_URL.TRANSACTIONS_ACCOUNTS_APPROVE}`,
    payload
  );
  return res.data;
};

export const AccountRequestPrefund = async (payload) => {
  const res = await ApiService.post(API_URL.REQUESTS_PREFUND, payload);
  return res.data;
};

export const RequestAccountActivation = async (payload) => {
  const res = await ApiService.post(
    API_URL.REQUESTS_ACCOUNT_ACTIVATION,
    payload
  );
  return res.data;
};

export const UploadAccActivationReceipt = async (payload) => {
  const res = await ApiService.post(
    API_URL.REQUESTS_ACCOUNT_ACTIVATION_RECEIPT,
    payload
  );
  return res.data;
};

export const RequestAccountActivationList = async (payload) => {
  const res = await ApiService.post(
    API_URL.REQUESTS_ACCOUNT_ACTIVATION_LIST,
    payload
  );
  return res.data;
};

export const CheckAccountActivateRequest = async (payload) => {
  const res = await ApiService.post(
    API_URL.REQUESTS_ACCOUNT_ACTIVATION_VALIDATE,
    payload
  );
  return res.data;
};

export const fetchPrefundRequests = async (payload) => {
  const res = await ApiService.post(API_URL.REQUESTS_PREFUND_LIST, payload);
  return res.data;
};

export const ApprovePrefunRequest = async (payload) => {
  const res = await ApiService.put(API_URL.REQUESTS_PREFUND_APPROVE, payload);
  return res.data;
};

export const UpdatePrefundStatus = async (payload) => {
  const res = await ApiService.put(
    API_URL.REQUESTS_PREFUND_UPDATE_STATUS,
    payload
  );
  return res.data;
};

export const UpdateAccountStatus = async (payload) => {
  const res = await ApiService.put(API_URL.ACCOUNTS_UPDATE_STATUS, payload);
  return res.data;
};

export const UpdateRequestAccountStatus = async (payload) => {
  const res = await ApiService.put(
    API_URL.REQUESTS_ACCOUNT_UPDATE_STATUS,
    payload
  );
  return res.data;
};

export const SwiftRegister = async (payload) => {
  const res = await ApiService.post(API_URL.SWIFT_REGISTRATION, payload);
  return res.data;
};

export const RequestCard = async (payload) => {
  const res = await ApiService.post(API_URL.REQUESTS_CARD, payload);
  return res.data;
};
export const fetchCardRequests = async (payload) => {
  const res = await ApiService.post(API_URL.REQUESTS_CARD_LIST, payload);
  return res.data;
};

export const UpdateCardRequestStatus = async (payload) => {
  const res = await ApiService.put(
    API_URL.REQUESTS_CARD_UPDATE_STATUS,
    payload
  );
  return res.data;
};

export const createManualTransaction = async (payload) => {
  const res = await ApiService.post(API_URL.TRANSACTIONS_MANUAL_CREATE, payload);
  return res.data;
};

export const fetchManualTransactions = async (payload) => {
  const res = await ApiService.post(API_URL.TRANSACTIONS_MANUAL_FIND, payload);
  return res.data;
};

export const editManualTransaction = async (payload) => {
  const res = await ApiService.post(API_URL.TRANSACTIONS_MANUAL_EDIT, payload);
  return res.data;
};

export default ApiService;
