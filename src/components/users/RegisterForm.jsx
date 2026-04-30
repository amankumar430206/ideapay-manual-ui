import React from "react";
import { Button } from "../buttons/Button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ROUTES } from "../../router/routes";
import { ACCOUNT_TYPES } from "../../consts/formValues";
import { UserRegister } from "../../api/api-service";
import { SectionHeader } from "../SectionHeader";

const UserRegisterForm = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const { isPending, mutate } = useMutation({
    mutationFn: UserRegister,
    onSuccess: (res) => {
      if (res.success) {
        console.log(res);
        reset();
        navigate(ROUTES.AUTH.LOGIN, {
          replace: true,
        });
      }
    },
  });
  const handleFormSubmit = (formData) => {
    // check for balance and  available funds in the account, before transfer
    console.log(formData);
    const data = new FormData();
    data.append("accountType", formData.accountType);
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);

    mutate(formData);
  };
  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <fieldset disabled={isPending}>
          <div className="row mb-4 g-3">
            <h5 className="text-center">Register</h5>
            <div className="col-sm-12 col-md-12 col-lg-12">
              <label
                htmlFor="accountType"
                className="form-label text-capitalize required"
              >
                Account Type
              </label>
              <select
                id="accountType"
                className={`form-select ${errors?.accountType && "is-invalid"}`}
                {...register("accountType", {
                  required: {
                    value: true,
                    message: "Required Field",
                  },
                })}
              >
                <option value=""></option>
                {ACCOUNT_TYPES?.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">
                {errors?.accountType && errors?.accountType.message}
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-12">
              <label
                htmlFor="firstName"
                className="form-label text-capitalize required"
              >
                first name
              </label>
              <div class="input-group ">
                <input
                  type="text"
                  id="firstName"
                  className={`form-control ${
                    errors?.firstName && "is-invalid"
                  }`}
                  {...register("firstName", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                />
                <div className="invalid-feedback">
                  {errors.firstName && errors.firstName.message}
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-12">
              <label
                htmlFor="lastName"
                className="form-label text-capitalize required"
              >
                last name
              </label>
              <div class="input-group ">
                <input
                  type="text"
                  id="lastName"
                  className={`form-control ${errors?.lastName && "is-invalid"}`}
                  {...register("lastName", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                />
                <div className="invalid-feedback">
                  {errors.lastName && errors.lastName.message}
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-12">
              <label
                htmlFor="email"
                className="form-label text-capitalize required"
              >
                email address
              </label>
              <div class="input-group ">
                <input
                  type="text"
                  id="email"
                  className={`form-control ${errors?.email && "is-invalid"}`}
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                />
                <div className="invalid-feedback">
                  {errors.email && errors.email.message}
                </div>
              </div>
            </div>
          </div>

          <p className="alert alert-light">
            <small>
              We will contact you prior to full account activation to request
              any additional information that might be required.
            </small>
          </p>

          <Button
            loading={isPending}
            className="btn btn-primary w-100 mb-3"
            text={"Create Account + "}
            type="submit"
          />

          <p className="text-center mt-4">Already have an account ?</p>
          <Link to={ROUTES.AUTH.LOGIN} className="btn btn-link w-100 mb-3">
            Login
          </Link>
        </fieldset>
      </form>
    </>
  );
};

export default UserRegisterForm;
