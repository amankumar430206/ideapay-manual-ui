import { useCan } from "../../hooks/useCan";
import { PageContent } from "../PageContent";
import { Section } from "../Section";

/**
 * Page-level guard. Renders children only when the current user has `perm`,
 * otherwise shows an "access denied" panel. Used in the router so direct-URL
 * navigation is enforced, not just nav-menu visibility.
 *
 * Safe by design (see useCan): SUPER bypasses, and roles with no saved
 * permission document stay permissive until configured.
 */
export const RequirePermission = ({ perm, children }) => {
  const can = useCan();

  if (can(perm)) return <>{children}</>;

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
