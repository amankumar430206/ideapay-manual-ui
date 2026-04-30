const APP_BASE = "/";
const DASHBOARD_BASE = "/me";

export const ROUTES = {
  APP_BASE: APP_BASE,
  NO_MATCH_ROUTE: "*",

  SIGN_UP: "/register",
  SIGN_UP_SUCCESS: "/register/success",

  // auth
  AUTH: {
    INDEX: "/authenticate",
    LOGIN: "/authenticate/login",
    LOGOUT: "/authenticate/logout",
    REGISTER: "/authenticate/register",
    VERIFY_OTP: "/authenticate/verify-otp",
    FORGOT_PASSWORD: "/authenticate/reset-password",
  },

  // Dashboard
  DASHBOARD: {
    INDEX: DASHBOARD_BASE,

    CLIENTS: {
      INDEX: DASHBOARD_BASE + "/clients",
    },

    ACCOUNTS: {
      INDEX: DASHBOARD_BASE + "/accounts",
    },

    CARDS: {
      INDEX: DASHBOARD_BASE + "/cards",
    },

    LEDGER: {
      INDEX: DASHBOARD_BASE + "/ledger",
    },

    TRANSACTIONS: {
      INDEX: DASHBOARD_BASE + "/transactions",
    },

    //
    TRANSFERS: {
      INDEX: DASHBOARD_BASE + "/transfers",
      ACCOUNT: DASHBOARD_BASE + "/transfers/accounts",
      USER: DASHBOARD_BASE + "/transfers/users",
      OUTGOING: DASHBOARD_BASE + "/transfers/outoging",
      INGOING: DASHBOARD_BASE + "/transfers/ingoing",
      CARD_FUNDING: DASHBOARD_BASE + "/transfers/card",
    },

    REPORTS: {
      INDEX: DASHBOARD_BASE + "/reports",
      ACCOUNT: DASHBOARD_BASE + "/reports/accounts",
      ALL_ACCOUNT: DASHBOARD_BASE + "/reports/accounts/all",
      BALANCES: DASHBOARD_BASE + "/reports/accounts/balances",
    },

    REQUESTS: {
      INDEX: DASHBOARD_BASE + "/requests",
      ACCOUNT: DASHBOARD_BASE + "/requests/accounts",
      USER: DASHBOARD_BASE + "/requests/users",
      OUTGOING: DASHBOARD_BASE + "/requests/outoging",
      INGOING: DASHBOARD_BASE + "/requests/ingoing",
      CARD_FUNDING: DASHBOARD_BASE + "/requests/card",
      PREFUND: DASHBOARD_BASE + "/requests/prefund",
      SWIFT_ONBOARD: DASHBOARD_BASE + "/requests/swift/onboarding",
      ACCOUNT_ACTIVATION: DASHBOARD_BASE + "/requests/accounts/activation",
      CARDS: DASHBOARD_BASE + "/requests/cards",
    },

    SWIFT: {
      INDEX: DASHBOARD_BASE + "/swift",
      ONBOARDING: DASHBOARD_BASE + "/swift/onboard",
      ONBOARDING_SUCCESS: DASHBOARD_BASE + "/swift/onboard/success",
      TERMS: DASHBOARD_BASE + "/swift/terms",
      ALL_ACCOUNT: DASHBOARD_BASE + "/swift/accounts/all",
      BALANCES: DASHBOARD_BASE + "/swift/accounts/balances",
      CLIENTS: DASHBOARD_BASE + "/swift/clients",
      DASHBOARD: DASHBOARD_BASE + "/swift/dashboard",
    },

    PROFILE: {
      INDEX: DASHBOARD_BASE + "/profile",
      ACCOUNT: DASHBOARD_BASE + "/profile/accounts",
      ALL_ACCOUNT: DASHBOARD_BASE + "/profile/accounts/all",
      BALANCES: DASHBOARD_BASE + "/profile/accounts/balances",
    },
  },
};
