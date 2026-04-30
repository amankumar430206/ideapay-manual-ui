import { Link, useNavigate } from "react-router-dom";
import { useActive } from "../hooks/useActive";
import { useRoutes } from "../hooks/useRoutes";

export const SubNavbar = () => {
  const navigate = useNavigate();
  const { isActive } = useActive();
  const { SUB_MENU } = useRoutes();

  const handleNavigate = (url) => navigate(url);

  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-white p-2 pb-0 shadow-sm"
        data-aos="fade-right"
      >
        <div className="container">
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto">
              {SUB_MENU.map((item) => {
                return (
                  <>
                    {item.show && (
                      <>
                        {item.children ? (
                          <li className="nav-item dropdown me-4">
                            <Link
                              className={`nav-link text-capitalize dropdown-toggle ${
                                isActive(item.path)
                                  ? "border-bottom border-primary border-3 fw-bold"
                                  : ""
                              }`}
                              role="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              {item.name}
                            </Link>
                            <ul className="dropdown-menu shadow">
                              {item.children.map((item) => (
                                <li>
                                  <Link
                                    to={item.path}
                                    className="dropdown-item text-capitalize"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ) : (
                          <li className="nav-item me-4">
                            <Link
                              to={item.path}
                              className={`nav-link text-capitalize ${
                                isActive(item.path)
                                  ? "border-bottom border-primary border-3 fw-bold"
                                  : ""
                              }`}
                              aria-current="page"
                            >
                              {item.name}
                            </Link>
                          </li>
                        )}
                      </>
                    )}
                  </>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
