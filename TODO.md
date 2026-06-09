# TODO — Roles & Permissions

Feature for managing per-role feature/action permissions, persisting them, and
(eventually) enforcing them across the app. Modeled on the LianLian
"Permissions settings" matrix.

## Status

| Area | State |
|------|-------|
| Permission catalog (features × actions) | ✅ Done |
| Management UI (per-role toggle matrix, select-all) | ✅ Done |
| Backend model + CRUD endpoints | ✅ Done |
| Save / load round-trip (management page) | ✅ Done |
| Enforcement infrastructure (`useCan`, `<Can>`, loader, store) | ✅ Done |
| **UI-level enforcement applied** (nav, pages, actions) | ✅ **Complete** |
| Page-level view guards (direct-URL access) | ✅ Done |
| Backend API-level permission guard | ⛔ Not started (next) |

> UI enforcement is COMPLETE across the app (nav + page guards + action buttons).
> Safe by design — SUPER bypasses, and a role with no saved permission doc stays
> permissive (legacy behavior) until it's configured. The remaining gap is
> **server-side** enforcement; see "Remaining work".

### UI gating coverage
- **Nav**: all items gated by `*.view` (`useRoutes.js`).
- **Page guards** (`RequirePermission`): clients, accounts, transactions,
  transaction-requests, roles-permissions (in `AppRouter.js`).
- **Action buttons / menus**:
  - clients: add client/transaction/currency, approve/reject/block
  - transactions: add, edit, export
  - accounts: add account, payment request, activate, update balance
  - request pages (prefund / transfer-account / swift / cards / activation):
    approve & reject
  - transaction-requests: approve & reject

## What exists

### Frontend (`ideapay-manual-ui`)
- `src/consts/Permissions.js` — `PERMISSION_GROUPS` (features × actions), `ACTIONS`,
  `permissionId()`, `ALL_PERMISSION_IDS`. Permission ids look like
  `payments.transactions.view`.
- `src/consts/AppRoles.js` — `ROLES`, `ROLE_META`, `ROLE_LIST`
  (added COMPLIANCE, CONTROLLER, ACCOUNTANT).
- `src/pages/settings/RolesPermissions.jsx` — management page. Route
  `SETTINGS.ROLES_PERMISSIONS` = `/me/settings/roles-permissions` (SUPER only).
- `src/api/api-service.js` — `fetchRolePermissions`, `updateRolePermissions`,
  `fetchMyPermissions`.
- `src/hooks/useCan.js` — `can(permId)` checker. SUPER bypasses; roles with no
  saved doc stay permissive (legacy) until configured; strict once configured.
- `src/components/permission/Can.jsx` — `<Can perm="...">children</Can>`.
- `src/hooks/useLoadPermissions.js` — loads current user's perms into `authSlice`.
  Mounted in `src/layouts/AppLayout.jsx`.
- `src/store/features/authSlice.js` — `permissions`, `permissionsConfigured`,
  `setPermissions` (persisted), cleared on logout.

### Backend (`ideapay-manual-be`)
- `src/models/RolePermissions.js` — `{ role (unique), permissions: [String], updatedBy }`.
- `src/controllers/roles.controller.js` — `list`, `me`, `update`.
- `src/routes/roles.routes.js` — `POST /roles/permissions/{list,me,update}` (VerifyToken).
  Registered as `RolesRouter` in `src/routes/routes.js`.
- `src/enums/roles.js` — added SUPER, COMPLIANCE, CONTROLLER, ACCOUNTANT.

## Extending UI enforcement to more screens

UI enforcement is already wired for nav + Transactions Export. To cover more:

1. Gate feature actions with `<Can perm="...">` or `useCan()`:
   ```jsx
   <Can perm="payments.transactions.create"><AddButton/></Can>
   ```
2. When converting an existing role-only check, AND it with the permission rather
   than widening the role boundary (don't expose a SUPER-only action to others).
3. Before flipping a role to "configured" in production, set its permissions via
   the management page (or seed defaults) so it isn't unexpectedly locked out.

## Remaining work

- [ ] Backend enforcement: `requirePermission("payments.transactions.create")`
      middleware that resolves `RolePermissions` by `req.decoded.role` and 403s.
      UI gating alone is not security — protect the write endpoints too.
- [ ] "Add Role" flow is a placeholder toast — build real create-role (name +
      description) if custom roles are needed, or keep roles fixed in the enum.
- [ ] Dirty-state tracking on the management page (warn on unsaved changes; the
      "Save" button currently saves only the active role).
- [ ] Invalidate / refetch a user's cached permissions when an admin edits the
      role they belong to (currently picked up on next login / reload).
- [ ] Default-permission seed script for existing environments.
- [ ] Decide handling for COMPLIANCE / CONTROLLER / ACCOUNTANT — they exist in the
      enum but no users/flows use them yet.
