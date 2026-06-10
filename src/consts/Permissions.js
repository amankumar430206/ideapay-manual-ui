// Permission actions a feature can expose. Mirrors the LianLian
// "Permissions settings" matrix (View / Create / Edit ...).
export const ACTIONS = {
  VIEW: "view",
  CREATE: "create",
  EDIT: "edit",
  DELETE: "delete",
  APPROVE: "approve",
  EXPORT: "export",
  REQUIRE: "require",
};

export const ACTION_LABELS = {
  [ACTIONS.VIEW]: "View",
  [ACTIONS.CREATE]: "Create",
  [ACTIONS.EDIT]: "Edit",
  [ACTIONS.DELETE]: "Delete",
  [ACTIONS.APPROVE]: "Approve",
  [ACTIONS.EXPORT]: "Export",
  [ACTIONS.REQUIRE]: "Require OTP",
};

// App features grouped by module, each with the actions it supports.
// `key` is the stable permission key (group.feature.action when flattened).
export const PERMISSION_GROUPS = [
  {
    key: "overview",
    name: "Overview",
    description: "Dashboard and high-level summaries.",
    features: [
      {
        key: "dashboard",
        name: "Dashboard",
        description: "View dashboard widgets and balances.",
        actions: [ACTIONS.VIEW],
      },
    ],
  },
  {
    key: "clients",
    name: "Clients",
    description: "Client onboarding and management.",
    features: [
      {
        key: "clients",
        name: "Clients",
        description: "Manage client records and details.",
        actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT],
      },
    ],
  },
  {
    key: "accounts",
    name: "Accounts",
    description: "Receiving / collection account management.",
    features: [
      {
        key: "accounts",
        name: "Accounts",
        description: "View, open and update accounts.",
        actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT],
      },
      {
        key: "account_activation",
        name: "Account Activation",
        description: "Activate accounts and review activation requests.",
        actions: [ACTIONS.VIEW, ACTIONS.APPROVE],
      },
    ],
  },
  {
    key: "payments",
    name: "Payments & Transactions",
    description: "Create, edit and approve payments / transactions.",
    features: [
      {
        key: "transactions",
        name: "Transactions",
        description: "Create and manage manual transactions.",
        actions: [
          ACTIONS.VIEW,
          ACTIONS.CREATE,
          ACTIONS.EDIT,
          ACTIONS.DELETE,
          ACTIONS.APPROVE,
          ACTIONS.EXPORT,
        ],
      },
      {
        key: "transaction_requests",
        name: "Transaction Requests",
        description: "Submit and review client transaction requests.",
        actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.APPROVE],
      },
      {
        key: "transfers",
        name: "Transfers",
        description: "Move funds between accounts.",
        actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.APPROVE],
      },
      {
        key: "payment_otp",
        name: "Payment OTP",
        description:
          "When checked, this role must verify via an emailed OTP before submitting a payment. If left unchecked, OTP verification is bypassed for this role.",
        actions: [ACTIONS.REQUIRE],
      },
    ],
  },
  {
    key: "requests",
    name: "Requests",
    description: "Operational requests requiring review.",
    features: [
      {
        key: "prefund_requests",
        name: "Prefund Requests",
        description: "Review and approve prefund requests.",
        actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.APPROVE],
      },
      {
        key: "transfer_account_requests",
        name: "Transfer Account Requests",
        description: "Review account transfer requests.",
        actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.APPROVE],
      },
      {
        key: "swift_onboarding_requests",
        name: "Swift Onboarding Requests",
        description: "Review SWIFT onboarding requests.",
        actions: [ACTIONS.VIEW, ACTIONS.APPROVE],
        hidden: true, // temporarily hidden — re-enable when needed
      },
      {
        key: "card_requests",
        name: "Card Requests",
        description: "Review card issuance requests.",
        actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.APPROVE],
        hidden: true, // temporarily hidden — re-enable when needed
      },
    ],
  },
  {
    key: "cards",
    name: "Cards",
    description: "Card management.",
    hidden: true, // temporarily hidden — re-enable when needed
    features: [
      {
        key: "cards",
        name: "Cards",
        description: "Issue and manage cards.",
        actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
      },
    ],
  },
  {
    key: "reports",
    name: "Reports & Ledger",
    description: "Financial reporting and ledger.",
    features: [
      {
        key: "reports",
        name: "Reports",
        description: "Credit / debit transaction reports.",
        actions: [ACTIONS.VIEW, ACTIONS.EXPORT],
      },
      {
        key: "ledger",
        name: "Ledger",
        description: "View and export the ledger.",
        actions: [ACTIONS.VIEW, ACTIONS.EXPORT],
      },
    ],
  },
  {
    key: "administration",
    name: "Administration",
    description: "System configuration and access control.",
    features: [
      {
        key: "roles_permissions",
        name: "Roles & Permissions",
        description: "Manage roles and feature permissions.",
        actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
      },
      {
        key: "profile_settings",
        name: "Profile & Settings",
        description: "Manage own profile and settings.",
        actions: [ACTIONS.VIEW, ACTIONS.EDIT],
      },
    ],
  },
];

// Unique id for one feature+action permission cell.
export const permissionId = (groupKey, featureKey, action) =>
  `${groupKey}.${featureKey}.${action}`;

// Permission that REQUIRES a role to verify payment via emailed OTP.
// Unchecked (absent) => OTP is bypassed for that role.
export const OTP_REQUIRE_PERMISSION = "payments.payment_otp.require";

// Groups/features not marked `hidden`. Drives the management UI so hidden
// items (e.g. cards, card requests, swift) don't show up but can be brought
// back simply by removing their `hidden` flag above.
export const VISIBLE_PERMISSION_GROUPS = PERMISSION_GROUPS.filter(
  (group) => !group.hidden
).map((group) => ({
  ...group,
  features: group.features.filter((feature) => !feature.hidden),
}));

// Flat list of every visible permission id across all groups/features.
export const ALL_PERMISSION_IDS = VISIBLE_PERMISSION_GROUPS.flatMap((group) =>
  group.features.flatMap((feature) =>
    feature.actions.map((action) => permissionId(group.key, feature.key, action))
  )
);

// Helper: build a list of permission ids for one feature.
const pids = (groupKey, featureKey, actions) =>
  actions.map((a) => permissionId(groupKey, featureKey, a));

const A = ACTIONS;

// Sensible default permission preset per role. Used by the "Apply Default
// Preset" button so an admin can start from a reasonable baseline instead of
// toggling every cell. Keys are role names (see consts/AppRoles ROLES).
export const DEFAULT_ROLE_PERMISSIONS = {
  SUPER: [...ALL_PERMISSION_IDS],

  ADMIN: [
    ...pids("overview", "dashboard", [A.VIEW]),
    ...pids("clients", "clients", [A.VIEW, A.CREATE, A.EDIT, A.DELETE, A.EXPORT]),
    ...pids("accounts", "accounts", [A.VIEW, A.CREATE, A.EDIT, A.DELETE, A.EXPORT]),
    ...pids("accounts", "account_activation", [A.VIEW, A.APPROVE]),
    ...pids("payments", "transactions", [A.VIEW, A.CREATE, A.EDIT, A.APPROVE, A.EXPORT]),
    ...pids("payments", "transaction_requests", [A.VIEW, A.APPROVE]),
    ...pids("payments", "transfers", [A.VIEW, A.CREATE, A.APPROVE]),
    ...pids("payments", "payment_otp", [A.REQUIRE]),
    ...pids("requests", "prefund_requests", [A.VIEW, A.APPROVE]),
    ...pids("requests", "transfer_account_requests", [A.VIEW, A.APPROVE]),
    ...pids("reports", "reports", [A.VIEW, A.EXPORT]),
    ...pids("reports", "ledger", [A.VIEW, A.EXPORT]),
    ...pids("administration", "profile_settings", [A.VIEW, A.EDIT]),
  ],

  CLIENT: [
    ...pids("overview", "dashboard", [A.VIEW]),
    ...pids("accounts", "accounts", [A.VIEW]),
    ...pids("accounts", "account_activation", [A.VIEW]),
    ...pids("payments", "transactions", [A.VIEW, A.EXPORT]),
    ...pids("payments", "transaction_requests", [A.VIEW, A.CREATE]),
    ...pids("payments", "transfers", [A.VIEW]),
    ...pids("payments", "payment_otp", [A.REQUIRE]),
    ...pids("requests", "prefund_requests", [A.VIEW, A.CREATE]),
    ...pids("requests", "transfer_account_requests", [A.VIEW, A.CREATE]),
    ...pids("reports", "reports", [A.VIEW]),
    ...pids("administration", "profile_settings", [A.VIEW, A.EDIT]),
  ],

  USER: [
    ...pids("overview", "dashboard", [A.VIEW]),
    ...pids("accounts", "accounts", [A.VIEW]),
    ...pids("payments", "transactions", [A.VIEW]),
    ...pids("administration", "profile_settings", [A.VIEW, A.EDIT]),
  ],

  // Hidden roles — minimal read-only baseline.
  COMPLIANCE: [
    ...pids("overview", "dashboard", [A.VIEW]),
    ...pids("payments", "transactions", [A.VIEW]),
    ...pids("payments", "transaction_requests", [A.VIEW]),
    ...pids("administration", "profile_settings", [A.VIEW]),
  ],
  CONTROLLER: [
    ...pids("overview", "dashboard", [A.VIEW]),
    ...pids("payments", "transactions", [A.VIEW, A.APPROVE]),
    ...pids("payments", "transaction_requests", [A.VIEW, A.APPROVE]),
    ...pids("administration", "profile_settings", [A.VIEW]),
  ],
  ACCOUNTANT: [
    ...pids("overview", "dashboard", [A.VIEW]),
    ...pids("reports", "reports", [A.VIEW, A.EXPORT]),
    ...pids("reports", "ledger", [A.VIEW, A.EXPORT]),
    ...pids("administration", "profile_settings", [A.VIEW]),
  ],
};
