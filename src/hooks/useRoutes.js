import { useSelector } from "react-redux";
import { ROUTES } from "../router/routes";
import { permitUser } from "../components/Roles";
import { ROLES } from "../consts/AppRoles";
import { useCan } from "./useCan";

export const useRoutes = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const can = useCan();

  // A nav item is visible only when the role allows it AND the role has the
  // feature's "view" permission (the latter is a no-op until the role is
  // configured, see useCan).
  const showFor = (roles, perm) => permitUser(roles, currentUser?.role) && can(perm);

  const SUB_MENU = [
    {
      name: "dashboard",
      path: ROUTES.DASHBOARD.CLIENT_DASHBOARD.INDEX,
      show: showFor([ROLES.ADMIN, ROLES.CLIENT, ROLES.USER], "overview.dashboard.view"),
    },
    {
      name: "clients",
      path: ROUTES.DASHBOARD.CLIENTS.INDEX,
      show: showFor([ROLES.ADMIN, ROLES.SUPER], "clients.clients.view"),
    },
    {
      name: "accounts",
      path: ROUTES.DASHBOARD.ACCOUNTS.INDEX,
      show: showFor([ROLES.ADMIN, ROLES.SUPER, ROLES.CLIENT, ROLES.USER], "accounts.accounts.view"),
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
      show: showFor(
        [ROLES.ADMIN, ROLES.SUPER, ROLES.CLIENT, ROLES.USER],
        "payments.transactions.view"
      ),
    },
    {
      name: "transaction requests",
      path: ROUTES.DASHBOARD.REQUESTS.TRANSACTION_REQUESTS,
      show: showFor([ROLES.SUPER], "payments.transaction_requests.view"),
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
      name: "roles & permissions",
      path: ROUTES.DASHBOARD.SETTINGS.ROLES_PERMISSIONS,
      show: showFor([ROLES.SUPER], "administration.roles_permissions.view"),
    },
    {
      name: "profile",
      path: ROUTES.DASHBOARD.PROFILE.INDEX,
      show: showFor(
        [ROLES.ADMIN, ROLES.SUPER, ROLES.CLIENT, ROLES.USER],
        "administration.profile_settings.view"
      ),
    },
  ];

  return {
    SUB_MENU,
  };
};
