import { useSelector } from "react-redux";
import { ROUTES } from "../router/routes";
import { permitUser } from "../components/Roles";
import { ROLES } from "../consts/AppRoles";

export const useRoutes = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  const SUB_MENU = [
    {
      name: "clients",
      path: ROUTES.DASHBOARD.CLIENTS.INDEX,
      show: permitUser([ROLES.ADMIN, ROLES.SUPER], currentUser?.role),
    },
    {
      name: "accounts",
      path: ROUTES.DASHBOARD.ACCOUNTS.INDEX,
      show: permitUser([ROLES.ADMIN, ROLES.SUPER, ROLES.CLIENT, ROLES.USER], currentUser?.role),
    },
    // {
    //   name: "cards",
    //   path: ROUTES.DASHBOARD.CARDS.INDEX,
    //   show: permitUser([ROLES.CLIENT, ROLES.USER], currentUser?.role),
    // },

    // client only
    // {
    //   name: "swift service",
    //   show: permitUser([ROLES.CLIENT, ROLES.USER], currentUser?.role),
    //   path: ROUTES.DASHBOARD.SWIFT.DASHBOARD,
    // },

    // admnin only
    // {
    //   name: "swift",
    //   path: ROUTES.DASHBOARD.SWIFT.CLIENTS,
    //   show: permitUser([ROLES.ADMIN, ROLES.SUPER], currentUser?.role),
    // },
    {
      name: "transactions",
      path: ROUTES.DASHBOARD.TRANSACTIONS.INDEX,
      show: permitUser([ROLES.ADMIN, ROLES.SUPER, ROLES.CLIENT, ROLES.USER], currentUser?.role),
    },
    {
      name: "reports",
      show: false,
      children: [
        // {
        //   name: "Specific Account Statement",
        //   path: ROUTES.DASHBOARD.REPORTS.ACCOUNT,
        // },
        {
          name: "Credit Transactions",
          path: ROUTES.DASHBOARD.REPORTS.ALL_ACCOUNT,
        },
        {
          name: "Debit Transactions",
          path: ROUTES.DASHBOARD.REPORTS.ALL_ACCOUNT,
        },
        // {
        //   name: "Fee Report",
        //   path: ROUTES.DASHBOARD.REPORTS.ALL_ACCOUNT,
        // },
      ],
    },
    {
      name: "requests",
      show: false,
      children: [
        {
          name: "Prefund Requests",
          path: ROUTES.DASHBOARD.REQUESTS.PREFUND,
        },
        {
          name: "Transfer Account Requests",
          path: ROUTES.DASHBOARD.REQUESTS.ACCOUNT,
        },
        {
          name: "Swift Onboarding Requests",
          path: ROUTES.DASHBOARD.REQUESTS.SWIFT_ONBOARD,
        },
        {
          name: "Account Activation Requests",
          path: ROUTES.DASHBOARD.REQUESTS.ACCOUNT_ACTIVATION,
        },
        {
          name: "Cards Requests",
          path: ROUTES.DASHBOARD.REQUESTS.CARDS,
        },
      ],
    },
    // {
    //   name: "ledger",
    //   path: ROUTES.DASHBOARD.LEDGER.INDEX,
    //   show: permitUser([ROLES.ADMIN, ROLES.SUPER, ROLES.CLIENT, ROLES.USER], currentUser?.role),
    // },
    {
      name: "profile",
      path: ROUTES.DASHBOARD.PROFILE.INDEX,
      show: permitUser([ROLES.ADMIN, ROLES.SUPER, ROLES.CLIENT, ROLES.USER], currentUser?.role),
    },
  ];

  return {
    SUB_MENU,
  };
};
