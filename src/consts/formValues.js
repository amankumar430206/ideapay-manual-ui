export const ALL_ACCOUNT_TYPES = [
  {
    typeName: "Personal",
    description: "Typically used for individual users for everyday transactions.",
  },
  {
    typeName: "Business",
    description: "Designed for business entities or organizations to manage their finances.",
  },
  {
    typeName: "Savings",
    description: "Intended for users who want to save money and earn interest.",
  },
  {
    typeName: "Joint",
    description: "Allows multiple users to share and manage the same account.",
  },
  {
    typeName: "Student",
    description: "Geared towards students with features like lower fees or specific benefits.",
  },
  {
    typeName: "Corporate",
    description: "Similar to a business account but tailored for larger corporations.",
  },
  {
    typeName: "Merchant",
    description: "Designed for merchants or businesses to receive payments.",
  },
  {
    typeName: "Investment",
    description: "Allows users to invest money in various financial instruments.",
  },
  {
    typeName: "Loan",
    description: "Tracks loans provided or taken by the user.",
  },
  {
    typeName: "Travel",
    description: "Suited for users who frequently travel, with features like multi-currency support.",
  },
  {
    typeName: "Charity",
    description: "Specifically for managing funds dedicated to charitable activities.",
  },
  {
    typeName: "Government",
    description: "For government organizations or agencies managing public funds.",
  },
];

export const ACCOUNT_TYPES = [
  {
    name: "Personal",
    value: "personal",
    description: "Typically used for individual users for everyday transactions.",
  },
  {
    name: "Corporate",
    value: "corporate",
    description: "Similar to a business account but tailored for larger corporations.",
  },
];

export const STATUS_ENUMS = {
  PENDING: "pending",
  APPROVED: "approved",
  ACTIVE: "active",
  REJECTED: "rejected",
  BLOCKED: "blocked",
};

export const KYC_STATUS = {
  PENDING: "PENDING",
  REGISTERED: "REGISTERED",
  UPLOAD_KYC: "UPLOAD_KYC",
  ACTIVATE_ACCOUNT: "ACTIVATE_ACCOUNT",
  UPLOAD_RECEIPT: "UPLOAD_RECEIPT",
  BLOCKED: "BLOCKED",
  COMPLETED: "COMPLETED",
};
export const STATUS_ENUMS_ICONS = {
  pending: "🕑 pending",
  approved: "✅ approved",
  rejected: "❌ rejected",
  blocked: "⛔ blocked",
};

export const STATUS_ENUMS_LIST = Object.values(STATUS_ENUMS);

export const UPDATE_ENUMS = [
  {
    text: "Hold",
    value: "pending",
  },
  {
    text: "Accept",
    value: "approved",
  },
  {
    text: "Reject",
    value: "rejected",
  },
  {
    text: "Block",
    value: "blocked",
  },
];

export const BUSINESS_TYPES = [
  {
    name: "Private Limited Company",
    shortname: "Ltd.",
    description:
      "A Private Limited Company is a business entity that is owned by shareholders and provides limited liability protection to its owners.",
  },
  {
    name: "Holding Company",
    shortname: "Holding Co.",
    description:
      "A Holding Company is a business entity that owns shares of other companies and may provide limited liability protection to its owners.",
  },
  {
    name: "Incorporation",
    shortname: "Incorp",
    description:
      "Incorporation involves the creation of a legal entity separate from its owners (shareholders). It offers limited liability protection to its shareholders and may have various tax implications.",
  },
  {
    name: "Limited Liability Company",
    shortname: "LLC",
    description:
      "A Limited Liability Company (LLC) is a business structure that combines the pass-through taxation of a partnership or sole proprietorship with the limited liability of a corporation. Owners are typically called members.",
  },
  {
    name: "Sole Proprietorship",
    shortname: "Sole Prop.",
    description:
      "A Sole Proprietorship is the simplest form of business entity where one individual owns and operates the business. The owner is personally liable for all debts and obligations of the business.",
  },
  {
    name: "Partnership",
    shortname: "Partnership",
    description:
      "A Partnership is a business structure where two or more individuals share ownership and management responsibilities. There are different types of partnerships, including general partnerships, limited partnerships, and limited liability partnerships.",
  },
  {
    name: "C Corporation",
    shortname: "C Corp",
    description:
      "A C Corporation is a separate legal entity from its owners (shareholders). It offers limited liability protection to its shareholders and allows for an unlimited number of shareholders. C corporations are subject to corporate income tax.",
  },
  {
    name: "S Corporation",
    shortname: "S Corp",
    description:
      "An S Corporation is a special type of corporation that elects to pass corporate income, losses, deductions, and credits through to their shareholders for federal tax purposes. It avoids double taxation.",
  },
  {
    name: "Nonprofit Corporation",
    shortname: "Nonprofit Corp",
    description:
      "A Nonprofit Corporation is formed for purposes other than making a profit. These organizations pursue charitable, educational, religious, or scientific goals. They are exempt from paying federal and state income taxes.",
  },
  {
    name: "Professional Corporation",
    shortname: "PC",
    description:
      "A Professional Corporation is a variation of the standard corporation structure used by licensed professionals such as doctors, lawyers, accountants, and architects. It provides the same liability protection as a regular corporation.",
  },
  {
    name: "Cooperative",
    shortname: "Co-op",
    description:
      "A Cooperative is a business owned and operated by its members, who share the profits and benefits according to their participation. Cooperatives are often formed to meet the common needs of their members.",
  },
];

export const CURRENCIES = [
  {
    code: "USD",
    name: "United States Dollar",
    country: "United States",
  },
  {
    code: "EUR",
    name: "Euro",
    country: "European Union",
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    country: "Japan",
  },
  {
    code: "GBP",
    name: "British Pound Sterling",
    country: "United Kingdom",
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    country: "Australia",
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    country: "Canada",
  },
  {
    code: "CHF",
    name: "Swiss Franc",
    country: "Switzerland",
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
    country: "China",
  },
  {
    code: "SEK",
    name: "Swedish Krona",
    country: "Sweden",
  },
  {
    code: "NZD",
    name: "New Zealand Dollar",
    country: "New Zealand",
  },
  {
    code: "SGD",
    name: "Singapore Dollar",
    country: "Singapore",
  },
  {
    code: "MYR",
    name: "Malaysian Ringgit",
    country: "Malaysia",
  },
  {
    code: "THB",
    name: "Thai Baht",
    country: "Thailand",
  },
  {
    code: "IDR",
    name: "Indonesian Rupiah",
    country: "Indonesia",
  },
  {
    code: "PHP",
    name: "Philippine Peso",
    country: "Philippines",
  },
  {
    code: "VND",
    name: "Vietnamese Dong",
    country: "Vietnam",
  },
  {
    code: "INR",
    name: "Indian Rupee",
    country: "India",
  },
];

export const TRANSFER_TYPE = {
  ACCOUNTS: "TNFS_ACCOUNTS",
  USERS: "TNFS_USERS",
  CARD_FUND: "TNFS_CARD_FUND",
  WIRE_OUT: "TNFS_WIRE_OUT",
  WIRE_IN: "TNFS_WIRE_IN",
};

export const StatusFilterOptions = [
  {
    name: "all",
    value: "",
  },
  {
    name: "pending",
    value: "pending",
  },
  {
    name: "approved",
    value: "approved",
  },
  {
    name: "rejected",
    value: "rejected",
  },
];

export const RBP_BANK_DETAILS = {
  bankName: "MALAYAN BANK BERHAD",
  swiftCode: "MBBEMYKL",
  benficiaryAccName: "ACE INVESTMENT BANK LIMITED (LL13216)",
  benficiaryAccNo: "764481000576 (MULTI- CURRENCY)",
  ultimateBenficiaryAccName: "ROYAL BANC PACIFIC BV",
  ultimateBenficiaryAccNo: "CUS-RBP1YQEICIHHCAB",
  purposeCode: "16620",
};

export const YES_NO = ["Yes", "No"];
export const PRODUCT_OFFERS_CLIENTS = ["Directly to individuals", "To other business and individuals", "Both"];
export const CARDS_RANGE = ["under 100", "101-1000", "1001-10000", "More than 10000"];

export const OPERATION_COUNTRIES = [
  {
    id: 132,
    name: "Malaysia",
    iso2: "MY",
  },
  {
    id: 233,
    name: "United States",
    iso2: "US",
  },
  // {
  //   id: 17,
  //   name: "The Bahamas",
  //   iso2: "BS",
  // },
  // {
  //   id: 214,
  //   name: "Switzerland",
  //   iso2: "CH",
  // },
  // {
  //   id: 231,
  //   name: "United Arab Emirates",
  //   iso2: "AE",
  // },
  // {
  //   id: 232,
  //   name: "United Kingdom",
  //   iso2: "GB",
  // },
];

export const CURRENCY_TYPES = [
  {
    value: "flat",
    label: "Flat",
  },
  {
    value: "crypto",
    label: "Crypto",
  },
];

export const CRYPTO_DETIALS = {
  walletAddress: "TSHXENEP8imF6UVr9HMu2SVvC6AgxbEF6z",
  type: "USDT TRC 20",
};
