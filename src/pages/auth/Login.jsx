import React, { useEffect, useState } from "react";
import { Button } from "../../components/buttons/Button";
import { PageContent } from "../../components/PageContent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { UserLogin, fetchUserById } from "../../api/api-service";
import { toast } from "react-toastify";
import { Section } from "../../components/Section";

import Logo from "../../static/app-logo-light.png";

import {
  clearAuth,
  setAuthToken,
  setCurrentRole,
  setCurrentUser,
  setCurrentUserId,
} from "../../store/features/authSlice";

import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import { ROLES } from "../../consts/AppRoles";
import { useDispatch, useSelector } from "react-redux";
import { useToggle } from "../../hooks/useToggle";
import { Eye, EyeOff } from "react-feather";

export const Route = {
  SUPER: ROUTES.DASHBOARD.CLIENTS.INDEX,
  // ADMIN: ROUTES.DASHBOARD.CLIENTS.INDEX,
  ADMIN: ROUTES.DASHBOARD.CLIENT_DASHBOARD.INDEX,
  CLIENT: ROUTES.DASHBOARD.CLIENT_DASHBOARD.INDEX,
  USER: ROUTES.DASHBOARD.CLIENT_DASHBOARD.INDEX,
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isToggle, handleToggle } = useToggle();

  const currentUser = useSelector((state) => state.auth.currentUser);
  const [user, setUser] = useState({
    id: null,
    role: null,
  });

  useEffect(() => {
    if (currentUser?.role)
      return navigate(Route[currentUser?.role], {
        replace: true,
      });

    dispatch(clearAuth());
  }, []);

  const userQuery = useQuery({
    queryKey: ["user", user.id],
    queryFn: () => fetchUserById({ id: user.id }),
    enabled: !!user?.id,
  });

  if (userQuery.isSuccess) {
    let content = userQuery.data?.content;
    dispatch(setCurrentUser(content));

    // based on role redirec to dashboard
    if (!Route[content.role]) navigate(ROUTES.AUTH.LOGIN);
    navigate(Route[content.role], {
      replace: true,
    });
  }

  const { isPending, mutate } = useMutation({
    mutationFn: UserLogin,
    onSuccess: (res) => {
      if (res.success) {
        dispatch(setAuthToken(res.content.token));
        dispatch(setCurrentUserId(res.content.id));
        dispatch(setCurrentRole(res.content?.role));
        setUser({
          id: res.content.id,
          role: res.content.role,
        });
      }
    },
    onError: () => {},
  });
  const handleFormSubmit = (formData) => {
    mutate({
      userId: formData.userId,
      password: formData.password,
    });
  };
  return (
    <PageContent>
      <div className="container py-5">
        <div className="row mt-5">
          <div className="col-sm-12 col-md-6 col-lg-4 offset-lg-4 offset-md-3">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <fieldset disabled={isPending}>
                <div className="row mb-4 g-3">
                  <Link
                    className="navbar-brand d-flex align-items-center w-100 justify-content-center mb-4 bg-light p-4 border"
                    to={ROUTES.AUTH.LOGIN}
                    data-aos="zoom-in"
                  >
                    <img
                      src={Logo}
                      alt="MyntPe-logo"
                      className="img-fluid"
                      style={{
                        height: "4rem",
                      }}
                    />
                  </Link>
                  <h5 className="text-center">Login</h5>
                  <div className="col-sm-12 col-md-12 col-lg-12">
                    <label htmlFor="userId" className="form-label text-capitalize required">
                      username
                    </label>
                    <input
                      type="text"
                      id="userId"
                      className={`form-control form-control-lg ${errors?.userId && "is-invalid"}`}
                      {...register("userId", {
                        required: {
                          value: true,
                          message: "Required Field",
                        },
                      })}
                    />
                    <div className="invalid-feedback">{errors.userId && errors.userId.message}</div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-12">
                    <label htmlFor="password" className="form-label text-capitalize required">
                      password
                    </label>
                    <div class="input-group ">
                      <input
                        id="password"
                        type={isToggle ? "text" : "password"}
                        className={`form-control form-control-lg ${errors?.password && "is-invalid"}`}
                        {...register("password", {
                          required: {
                            value: true,
                            message: "Required Field",
                          },
                        })}
                      />
                      <button
                        type="button"
                        onClick={handleToggle}
                        style={{ cursor: "pointer" }}
                        className="input-group-text rounded-end"
                      >
                        {isToggle ? <Eye size={16} color="grey" /> : <EyeOff size={16} color="grey" />}
                      </button>
                      <div className="invalid-feedback">{errors.password && errors.password.message}</div>
                    </div>
                  </div>
                  <Button
                    className="btn btn-link"
                    text={"Forgot Password ?"}
                    type="button"
                    onClick={() => navigate(ROUTES.AUTH.FORGOT_PASSWORD)}
                  />
                </div>

                <Button
                  loading={isPending}
                  className="btn btn-primary btn-lg w-100 mb-3"
                  text={"Sign In"}
                  type="submit"
                />
                <Section>
                  <p className="text-center">Don't have account ?</p>
                  <Link to={ROUTES.SIGN_UP} className="btn btn-link w-100 mb-3">
                    Sign Up
                  </Link>
                </Section>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </PageContent>
  );
};

export default Login;
