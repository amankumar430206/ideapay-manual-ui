import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useUserType } from "../hooks/useUserType";
import { ROUTES } from "../router/routes";
import Logo from "../static/app-logo-light.png";
import { clearAuth } from "../store/features/authSlice";
import { KYC_STATUS, STATUS_ENUMS } from "../consts/formValues";

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const { isAdmin, isSuperAdmin } = useUserType();

  console.log("Current User in Navbar:", currentUser); // Debug log for currentUser

  const isUserActive = currentUser?.status === STATUS_ENUMS.APPROVED && currentUser?.kycStatus === KYC_STATUS.COMPLETED;

  const firstName = currentUser?.firstName ?? "";
  const lastName = currentUser?.lastName ?? "";
  const displayName = `${firstName} ${lastName}`.trim();
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "U";

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate(ROUTES.AUTH.LOGOUT);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500&display=swap');

        .nb-root {
          --nb-bg:      #0a0f1e;
          --nb-border:  rgba(255,255,255,.07);
          --nb-accent:  #1a56ff;
          --nb-gold:    #f5a623;
          --nb-text:    rgba(255,255,255,.72);
          --nb-text-hi: #ffffff;
          --nb-muted:   rgba(255,255,255,.35);
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Shell ── */
        .nb-root .navbar {
          background: var(--nb-bg) !important;
          border-bottom: 1px solid var(--nb-border);
          padding-top: .6rem;
          padding-bottom: .6rem;
        }

        /* ── Logo ── */
        .nb-logo {
          display: flex;
          align-items: center;
          gap: .55rem;
          text-decoration: none;
        }
        .nb-logo img {
          height: 1.9rem;
          filter: brightness(0) invert(1);
        }
        .nb-logo-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--nb-text-hi);
          letter-spacing: -.02em;
          line-height: 1;
        }

        /* ── Admin badge ── */
        .nb-admin-badge {
          font-size: .67rem !important;
          font-weight: 500;
          letter-spacing: .07em;
          text-transform: uppercase;
          color: var(--nb-gold) !important;
          background: rgba(245,166,35,.12) !important;
          border: 1px solid rgba(245,166,35,.28);
          padding: .25rem .65rem !important;
          border-radius: 100px !important;
          font-family: 'DM Sans', sans-serif;
        }
        .nb-super-admin-badge {
          font-size: .67rem !important;
          font-weight: 500;
          letter-spacing: .07em;
          text-transform: uppercase;
          color: var(--nb-gold) !important;
          background: rgba(245,166,35,.12) !important;
          border: 1px solid rgba(245,166,35,.28);
          padding: .25rem .65rem !important;
          border-radius: 100px !important;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Avatar trigger pill ── */
        .nb-user-pill {
          display: flex;
          align-items: center;
          gap: .55rem;
          background: rgba(255,255,255,.05);
          border: 1px solid var(--nb-border);
          border-radius: 100px;
          padding: .28rem .75rem .28rem .28rem;
          cursor: pointer;
          transition: background .15s, border-color .15s;
          text-decoration: none !important;
        }
        .nb-user-pill::after { display: none !important; } /* remove BS caret */
        .nb-user-pill:hover,
        .nb-user-pill.show {
          background: rgba(255,255,255,.09);
          border-color: rgba(255,255,255,.14);
        }

        .nb-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--nb-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: .65rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
          letter-spacing: .02em;
        }

        .nb-display-name {
          font-size: .84rem;
          font-weight: 500;
          color: var(--nb-text-hi);
          text-transform: capitalize;
          max-width: 130px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .nb-caret {
          color: var(--nb-muted);
          transition: transform .2s;
          flex-shrink: 0;
        }
        .nb-user-pill.show .nb-caret { transform: rotate(180deg); }

        /* ── Dropdown ── */
        .nb-root .dropdown-menu {
          background: #111827;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 12px;
          padding: .4rem;
          min-width: 190px;
          margin-top: .5rem !important;
          box-shadow: 0 20px 50px rgba(0,0,0,.5);
        }

        .nb-dd-header {
          padding: .55rem .75rem .65rem;
          border-bottom: 1px solid rgba(255,255,255,.07);
          margin-bottom: .35rem;
        }
        .nb-dd-header-name {
          font-size: .86rem;
          font-weight: 500;
          color: #fff;
          text-transform: capitalize;
          line-height: 1.3;
        }
        .nb-dd-header-role {
          font-size: .7rem;
          color: var(--nb-muted);
          margin-top: .15rem;
        }

        .nb-root .dropdown-item {
          font-size: .84rem;
          color: rgba(255,255,255,.65);
          border-radius: 7px;
          padding: .5rem .75rem;
          display: flex;
          align-items: center;
          gap: .55rem;
          transition: background .14s, color .14s;
          cursor: pointer;
          border: none;
          width: 100%;
          text-align: left;
          background: transparent;
          text-decoration: none;
        }
        .nb-root .dropdown-item:hover {
          background: rgba(255,255,255,.07);
          color: #fff;
        }
        .nb-root .dropdown-item.nb-logout {
          color: rgba(239,83,80,.8);
          margin-top: .2rem;
        }
        .nb-root .dropdown-item.nb-logout:hover {
          background: rgba(229,57,53,.1);
          color: #ef5350;
        }
        .nb-root .dropdown-divider {
          border-color: rgba(255,255,255,.07);
          margin: .3rem .5rem;
        }

        /* ── Toggler ── */
        .nb-root .navbar-toggler {
          border-color: rgba(255,255,255,.15);
          padding: .28rem .5rem;
        }
        .nb-root .navbar-toggler:focus { box-shadow: none; }
        .nb-root .navbar-toggler-icon { filter: invert(1) opacity(.55); }
      `}</style>

      <div className="nb-root">
        <nav className="navbar navbar-expand-md" data-bs-theme="dark">
          <div className="container">
            {/* Logo */}
            <div className="nb-logo navbar-brand">
              <span className="nb-logo-name">IdeaPay</span>
            </div>

            {/* Admin badge */}
            {isAdmin && <span className="badge nb-admin-badge me-auto d-none d-md-inline-flex">Admin</span>}
            {isSuperAdmin && (
              <span className="badge nb-super-admin-badge me-auto d-none d-md-inline-flex">Super Admin</span>
            )}

            {/* Mobile toggler */}
            <button
              className="navbar-toggler ms-auto"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#nbCollapse"
              aria-controls="nbCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            {/* Collapsible area */}
            {currentUser && (
              <div className="collapse navbar-collapse" id="nbCollapse">
                <ul className="navbar-nav ms-auto mb-2 mb-md-0 align-items-md-center">
                  <li className="nav-item dropdown">
                    {/* Avatar pill trigger */}
                    <a
                      className="nb-user-pill dropdown-toggle"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="nb-avatar">{initials}</div>
                      <span className="nb-display-name">{displayName || "Account"}</span>
                      <svg className="nb-caret" width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path
                          d="M1 1l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>

                    <ul className="dropdown-menu dropdown-menu-end">
                      {/* Header */}
                      <li>
                        <div className="nb-dd-header">
                          <div className="nb-dd-header-name">{displayName}</div>
                          <div className="nb-dd-header-role">{isAdmin ? "Administrator" : "Account Holder"}</div>
                        </div>
                      </li>

                      {/* Profile */}
                      {isUserActive && (
                        <li>
                          <Link className="dropdown-item" to={ROUTES.DASHBOARD.PROFILE.INDEX}>
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="8" r="4" />
                              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                            </svg>
                            My Profile
                          </Link>
                        </li>
                      )}

                      <li>
                        <hr className="dropdown-divider" />
                      </li>

                      {/* Logout */}
                      <li>
                        <button className="dropdown-item nb-logout" onClick={handleLogout}>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};
