import { useSelector } from "react-redux";
import { useCan } from "../../hooks/useCan";
import { permitUser } from "../Roles";
import { PageContent } from "../PageContent";
import { Section } from "../Section";

/**
 * Page-level guard. Renders children only when access is allowed, otherwise
 * shows an "access denied" panel. Used in the router so direct-URL navigation
 * is enforced, not just nav-menu visibility.
 *
 * - `roles`: optional strict allow-list of roles. When provided, the current
 *   user's role MUST be in it (no permissive fallback) — use this for hard
 *   role boundaries (e.g. SUPER-only pages).
 * - `perm`: optional permission id checked via useCan (SUPER bypasses, and
 *   roles with no saved permission document stay permissive until configured).
 *
 * If both are given, both must pass.
 */
export const RequirePermission = ({ roles, perm, children }) => {
  const can = useCan();
  const role = useSelector((state) => state.auth.currentUser?.role);

  const roleOk = !roles || permitUser(roles, role);
  const permOk = !perm || can(perm);

  if (roleOk && permOk) return <>{children}</>;

  return (
    <PageContent>
      <Section className="mt-5">
        <div className="text-center py-5">
          <h4 className="fw-light mb-2">Access denied</h4>
          <p className="text-muted mb-0">
            You don't have permission to view this page. Contact an administrator
            if you believe this is a mistake.
          </p>
        </div>
      </Section>
    </PageContent>
  );
};
