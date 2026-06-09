export const ROLES = {
  SUPER: "SUPER",
  ADMIN: "ADMIN",
  CLIENT: "CLIENT",
  USER: "USER",
  COMPLIANCE: "COMPLIANCE",
  CONTROLLER: "CONTROLLER",
  ACCOUNTANT: "ACCOUNTANT",
};

// Display metadata for each role — used by the Roles & Permissions screen.
export const ROLE_META = {
  [ROLES.SUPER]: {
    label: "Super Admin",
    description: "Full access. Creates, edits and approves transactions.",
  },
  [ROLES.ADMIN]: {
    label: "Admin",
    description: "Manages clients, accounts and day-to-day operations.",
  },
  [ROLES.CLIENT]: {
    label: "Client",
    description: "Views own accounts and submits transaction requests.",
  },
  [ROLES.USER]: {
    label: "User",
    description: "End user with limited, view-oriented access.",
  },
  [ROLES.COMPLIANCE]: {
    label: "Compliance",
    description: "Reviews requests and monitors activity for compliance.",
  },
  [ROLES.CONTROLLER]: {
    label: "Controller",
    description: "Oversees approvals and financial controls.",
  },
  [ROLES.ACCOUNTANT]: {
    label: "Accountant",
    description: "Works with ledger, reports and reconciliation.",
  },
};

// Ordered list of roles for tabs / pickers.
export const ROLE_LIST = [
  ROLES.SUPER,
  ROLES.ADMIN,
  ROLES.CLIENT,
  ROLES.USER,
  ROLES.COMPLIANCE,
  ROLES.CONTROLLER,
  ROLES.ACCOUNTANT,
];

// Roles temporarily hidden from the management UI. Remove from here to bring
// a role back into the Roles & Permissions selector when it's needed.
export const HIDDEN_ROLES = [
  ROLES.COMPLIANCE,
  ROLES.CONTROLLER,
  ROLES.ACCOUNTANT,
];

// Roles actually shown in the management UI selector.
export const VISIBLE_ROLE_LIST = ROLE_LIST.filter(
  (role) => !HIDDEN_ROLES.includes(role)
);
