import React, { useState } from "react";
import { Button, ButtonGroup } from "../../components/buttons/Button";
import { PageContent } from "../../components/PageContent";
import { Section } from "../../components/Section";
import { Table, Row, Data } from "../../components/table/table";
import { Check, CheckCircle, Search } from "react-feather";
import { StatsCard } from "../../components/cards/statsCard";
import { ActionMenu } from "../../components/ActionMenu";
import { useMutation, useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import { formatAmount, getAmountWithCurrency } from "../../utils/utils";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { SectionHeader } from "../../components/SectionHeader";

import Logo from "../../static/rbp-dark.png";

import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import { AuthResetPassword } from "../../api/api-service";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const Mutation = useMutation({
    mutationFn: AuthResetPassword,
    onSuccess: (res) => {
      if (res.success) {
        navigate(ROUTES.AUTH.LOGIN, {
          replace: true,
        });
      }
    },
    onError: () => {
      navigate(ROUTES.AUTH.LOGIN, {
        replace: true,
      });
    },
  });
  const handleFormSubmit = (formData) => {
    // check for balance and  available funds in the account, before transfer

    Mutation.mutate({
      userId: formData.username,
    });
  };
  return (
    <PageContent>
      <div className="container py-5">
        <div className="row mt-5">
          <div className="col-sm-12 col-md-6 col-lg-4 offset-lg-4 offset-md-3">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <fieldset disabled={Mutation.isPending}>
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
                        height: "2rem",
                      }}
                    />
                    <h5 className="m-0 ms-2 fw-bold text-primary">
                      Royal Bank Pacific
                    </h5>
                  </Link>
                  <h5 className="text-center">Forgot Password</h5>
                  <div className="alert alert-info">
                    Don't worry! Resetting your password is easy. Just type in
                    the email you registered to MyntPe.
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-12">
                    <label
                      htmlFor="username"
                      className="form-label text-capitalize required"
                    >
                      Email / User Id
                    </label>
                    <input
                      type="text"
                      id="username"
                      className={`form-control form-control-lg ${
                        errors?.username && "is-invalid"
                      }`}
                      {...register("username", {
                        required: {
                          value: true,
                          message: "Required Field",
                        },
                      })}
                    />
                    <div className="invalid-feedback">
                      {errors.username && errors.username.message}
                    </div>
                  </div>
                </div>

                <Button
                  loading={Mutation.isPending}
                  className="btn btn-lg btn-primary w-100 mb-3"
                  text={"Submit"}
                  type="submit"
                />
                <p className="text-center mt-4">Know Your Account ?</p>
                <Button
                  className="btn btn-lg btn-link w-100"
                  text={"Login ?"}
                  type="button"
                  onClick={() =>
                    navigate(ROUTES.AUTH.LOGIN, {
                      replace: true,
                    })
                  }
                />
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </PageContent>
  );
};

export default Login;
