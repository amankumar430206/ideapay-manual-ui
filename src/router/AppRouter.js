import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../router/routes";
import { ROLES } from "../consts/AppRoles";
import { BlankLayout } from "../layouts/BlankLayout";
import { AppLayout } from "../layouts/AppLayout";

import { Spinner } from "../components/spinner";

import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/users/Register";
import ResetPasswordPage from "../pages/auth/ResetPassword";
import { CardsPage } from "../pages/cards";
import AppLayoutLoader from "../components/loaders/AppLayoutLoader";
import PageContentLoader from "../components/loaders/PageContentLoader";
import LogoutPage from "../pages/auth/Logout";
import { RequirePermission } from "../components/permission/RequirePermission";

const ClientsPage = lazy(() => import("../pages/clients"));
const AccountsPage = lazy(() => import("../pages/accounts"));
const TransferPage = lazy(() => import("../pages/transfers"));
const ReportsPage = lazy(() => import("../pages/reports"));
const OtpVerificationPage = lazy(() => import("../pages/auth/VerifyOtp"));
const SwiftOnboardingPage = lazy(() => import("../pages/swift/SwiftOnboarding"));
const SwiftOnboardingSuccessPage = lazy(() => import("../pages/swift/SwiftOnboarding"));
const SwiftClientsPage = lazy(() => import("../pages/swift/SwiftClients"));
const SwiftBoardPage = lazy(() => import("../pages/swift/SwiftBoard"));
const SwiftPage = lazy(() => import("../pages/swift"));
const LedgerPage = lazy(() => import("../pages/ledger"));
const TransactionsPage = lazy(() => import("../pages/transactions"));
const RequestsPage = lazy(() => import("../pages/requests"));
const RequestAccountsPage = lazy(() => import("../pages/requests/RequestAccounts"));
const RequestPrefundPage = lazy(() => import("../pages/requests/RequestPrefund"));
const RequestSwiftOnboardPage = lazy(() => import("../pages/requests/RequestSwiftOnboarding"));

const RequestAccountActivationPge = lazy(() => import("../pages/requests/RequestAccountActivation"));

const RequestCardPage = lazy(() => import("../pages/requests/RequestCards"));
const RequestTransactionsPage = lazy(() => import("../pages/requests/RequestTransactions"));

const ClientDashboardPage = lazy(() => import("../pages/dashboard/ClientDashboard"));
const ReportsAccountPage = lazy(() => import("../pages/reports/ReportsAccounts"));
const ReportsAllAccountPage = lazy(() => import("../pages/reports/ReportsAllAccounts"));
const ReportsBalancesPage = lazy(() => import("../pages/reports/ReportsBalances"));
const ProfilePage = lazy(() => import("../pages/settings/Profile"));
const RolesPermissionsPage = lazy(() => import("../pages/settings/RolesPermissions"));

export const AppRouter = createBrowserRouter([
  {
    path: ROUTES.APP_BASE,
    element: <Navigate to={ROUTES.AUTH.LOGIN} />,
  },

  // Auth Pages
  {
    path: ROUTES.AUTH.INDEX,
    element: (
      <Suspense fallback={<Spinner text={"Please wait.."} />}>
        <BlankLayout />
      </Suspense>
    ),
    children: [
      {
        path: ROUTES.AUTH.LOGIN,
        element: <LoginPage />,
      },

      {
        path: ROUTES.AUTH.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: ROUTES.AUTH.FORGOT_PASSWORD,
        element: <ResetPasswordPage />,
      },
      {
        path: ROUTES.AUTH.VERIFY_OTP,
        element: <OtpVerificationPage />,
      },
      {
        path: ROUTES.AUTH.LOGOUT,
        element: <LogoutPage />,
      },
    ],
  },

  {
    path: ROUTES.SIGN_UP,
    element: (
      <Suspense fallback={<Spinner text={"Please wait.."} />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.SIGN_UP,
    element: (
      <Suspense fallback={<Spinner text={"Please wait.."} />}>
        <RegisterPage />
      </Suspense>
    ),
  },

  // Dashboard Pages
  {
    path: ROUTES.DASHBOARD.INDEX,
    element: (
      <Suspense fallback={<AppLayoutLoader />}>
        <AppLayout />
      </Suspense>
    ),
    children: [
      {
        path: ROUTES.DASHBOARD.CLIENT_DASHBOARD.INDEX,
        element: (
          <Suspense fallback={<PageContentLoader />}>
            <ClientDashboardPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.DASHBOARD.CLIENTS.INDEX,
        element: (
          <Suspense fallback={<PageContentLoader />}>
            <RequirePermission roles={[ROLES.SUPER]}>
              <ClientsPage />
            </RequirePermission>
          </Suspense>
        ),
      },
      {
        path: ROUTES.DASHBOARD.ACCOUNTS.INDEX,
        element: (
          <Suspense fallback={<PageContentLoader />}>
            <RequirePermission perm="accounts.accounts.view">
              <AccountsPage />
            </RequirePermission>
          </Suspense>
        ),
      },
      {
        path: ROUTES.DASHBOARD.CARDS.INDEX,
        element: (
          <Suspense fallback={<PageContentLoader />}>
            <CardsPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.DASHBOARD.TRANSFERS.INDEX,
        element: (
          <Suspense fallback={<PageContentLoader />}>
            <TransferPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.DASHBOARD.REPORTS.INDEX,
        element: (
          <Suspense fallback={<PageContentLoader />}>
            <ReportsPage />
          </Suspense>
        ),
        children: [
          {
            path: ROUTES.DASHBOARD.REPORTS.ACCOUNT,
            element: <ReportsAccountPage />,
          },
          {
            path: ROUTES.DASHBOARD.REPORTS.ALL_ACCOUNT,
            element: <ReportsAllAccountPage />,
          },
          {
            path: ROUTES.DASHBOARD.REPORTS.BALANCES,
            element: <ReportsBalancesPage />,
          },
        ],
      },
      {
        path: ROUTES.DASHBOARD.REQUESTS.INDEX,
        element: (
          <Suspense fallback={<PageContentLoader />}>
            <RequestsPage />
          </Suspense>
        ),
        children: [
          {
            path: ROUTES.DASHBOARD.REQUESTS.ACCOUNT,
            element: <RequestAccountsPage />,
          },
          {
            path: ROUTES.DASHBOARD.REQUESTS.PREFUND,
            element: <RequestPrefundPage />,
          },
          {
            path: ROUTES.DASHBOARD.REQUESTS.SWIFT_ONBOARD,
            element: <RequestSwiftOnboardPage />,
          },
          {
            path: ROUTES.DASHBOARD.REQUESTS.ACCOUNT_ACTIVATION,
            element: <RequestAccountActivationPge />,
          },
          {
            path: ROUTES.DASHBOARD.REQUESTS.CARDS,
            element: <RequestCardPage />,
          },
          {
            path: ROUTES.DASHBOARD.REQUESTS.TRANSACTION_REQUESTS,
            element: (
              <Suspense fallback={<PageContentLoader />}>
                <RequirePermission roles={[ROLES.SUPER, ROLES.ADMIN]}>
                  <RequestTransactionsPage />
                </RequirePermission>
              </Suspense>
            ),
          },
        ],
      },
      {
        path: ROUTES.DASHBOARD.SWIFT.INDEX,
        element: (
          <Suspense fallback={<PageContentLoader />}>
            <SwiftPage />
          </Suspense>
        ),
        children: [
          {
            path: ROUTES.DASHBOARD.SWIFT.DASHBOARD,
            element: <SwiftBoardPage />,
          },
          {
            path: ROUTES.DASHBOARD.SWIFT.CLIENTS,
            element: <SwiftClientsPage />,
          },
          {
            path: ROUTES.DASHBOARD.SWIFT.ONBOARDING,
            element: <SwiftOnboardingPage />,
          },
          {
            path: ROUTES.DASHBOARD.SWIFT.ONBOARDING_SUCCESS,
            element: <SwiftOnboardingSuccessPage />,
          },
        ],
      },
      {
        path: ROUTES.DASHBOARD.LEDGER.INDEX,
        element: (
          <Suspense fallback={<PageContentLoader />}>
            <LedgerPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.DASHBOARD.TRANSACTIONS.INDEX,
        element: (
          <Suspense fallback={<PageContentLoader />}>
            <RequirePermission perm="payments.transactions.view">
              <TransactionsPage />
            </RequirePermission>
          </Suspense>
        ),
      },
      {
        path: ROUTES.DASHBOARD.PROFILE.INDEX,
        element: <ProfilePage />,
      },
      {
        path: ROUTES.DASHBOARD.SETTINGS.ROLES_PERMISSIONS,
        element: (
          <Suspense fallback={<PageContentLoader />}>
            <RequirePermission perm="administration.roles_permissions.view">
              <RolesPermissionsPage />
            </RequirePermission>
          </Suspense>
        ),
      },
    ],
  },
]);
