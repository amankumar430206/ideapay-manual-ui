import { useCan } from "../../hooks/useCan";

/**
 * Conditionally renders children when the current user has `perm`.
 *
 *   <Can perm="payments.transactions.create">
 *     <CreateButton />
 *   </Can>
 *
 * Pass `fallback` to render something when access is denied.
 */
export const Can = ({ perm, children, fallback = null }) => {
  const can = useCan();
  return can(perm) ? <>{children}</> : fallback;
};
