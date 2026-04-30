export const API_URL = {
  // auth
  USER_LOGIN: "/auth/user/login",
  USER_RESET_PASS: "/auth/user/reset-password",
  USER_VERIFY_OTP: "/auth/user/verify-otp",
  USER_REGISTER: "/users/register",
  USER_SIGNUP: "/users/signup",

  // users
  USERS: "/users",
  USERS_KYC_UPDATE: "/users/kyc",
  USERS_UPDATE_STATUS: "/users/update/status",
  USERS_STATS: "/users/statistics",

  // accounts
  ACCOUNTS: "/accounts",
  ACCOUNTS_USER: "/accounts/user",
  ACCOUNTS_NEW: "/accounts/open",
  ACCOUNTS_UPDATE_BALANCE: "/accounts/update/balance",
  ACCOUNTS_STATS: "/accounts/statistics",
  ACCOUNTS_UPDATE_STATUS: "/accounts/update/status",

  // pool accounts
  POOL_ACCOUNTS: "/accounts/pool",
  POOL_ACCOUNTS_NEW: "/accounts/pool/open",

  // transafers
  TRANSFERS: "/transfer",
  TRANSFERS_ACC: "/transfer/accounts",
  TRANSFERS_USERS: "/transfer/users",
  TRANSFERS_WIREIN: "/transfer/wirein",
  TRANSFERS_WIREOUT: "/transfer/wireout",

  // transactions
  TRANSACTIONS: "/transactions",
  TRANSACTIONS_ACC: "/transactions/accounts",
  TRANSACTIONS_ACCOUNTS_APPROVE: "/transactions/accounts/approve",
  TRANSACTIONS_UPDATE_STATUS: "/transactions/update/status",

  // requests
  REQUESTS_PREFUND: "/requests/prefund",
  REQUESTS_PREFUND_LIST: "/requests/prefund/list",
  REQUESTS_PREFUND_APPROVE: "/requests/prefund/approve",
  REQUESTS_PREFUND_UPDATE_STATUS: "/requests/prefund/update/status",
  REQUESTS_ACCOUNT_UPDATE_STATUS: "/requests/accounts/update/status",

  REQUESTS_ACCOUNT_ACTIVATION: "/requests/accounts/activate",
  REQUESTS_ACCOUNT_ACTIVATION_RECEIPT: "/requests/accounts/upload/receipt",
  REQUESTS_ACCOUNT_ACTIVATION_LIST: "/requests/accounts",
  REQUESTS_ACCOUNT_ACTIVATION_VALIDATE: "/requests/accounts/validate",

  REQUESTS_CARD: "/requests/card",
  REQUESTS_CARD_LIST: "/requests/card/list",
  REQUESTS_CARD_UPDATE_STATUS: "/requests/card/update/status",

  // swift service
  SWIFT_REGISTRATION: "/users/register/swift",

  // manual transactions
  TRANSACTIONS_MANUAL_CREATE: "/transactions/manual/create",
  TRANSACTIONS_MANUAL_FIND: "/transactions/manual/find",
  TRANSACTIONS_MANUAL_EDIT: "/transactions/manual/edit",

  // Sureapass API
  SUREPASS_VERIFY_PASSPORT: "/ocr/international-passport-v2",
};
