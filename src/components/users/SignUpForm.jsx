import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  AuthEmailVerification,
  UserRegister,
  UserSignUp,
} from "../../api/api-service";
import { ACCOUNT_TYPES } from "../../consts/formValues";
import { Section } from "../Section";
import { SectionHeader } from "../SectionHeader";
import { Button, ButtonGroup } from "../buttons/Button";
import { ROUTES } from "../../router/routes";
import { toast } from "react-toastify";

const UserRegisterForm = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [verify, setVerify] = useState(false);
  const [payload, setPayload] = useState(null);

  const { isPending, mutate } = useMutation({
    mutationFn: UserSignUp,
    onSuccess: (res) => {
      if (res.success) {
        setVerify(true);
      }
    },
    onError: () => {},
  });

  const OTPMutaion = useMutation({
    mutationFn: AuthEmailVerification,
    onSuccess: (res) => {
      if (res.success) {
        setVerify(false);
        navigate(ROUTES.AUTH.LOGIN);
      }
    },
    onError: () => {},
  });

  const handleFormSubmit = (formData) => {
    setPayload(formData);

    if (verify) {
      return OTPMutaion.mutate({
        email: payload.email,
        verificationCode: formData.otp,
      });
    }

    // check for balance and  available funds in the account, before transfer
    const data = {};
    data.accountType = formData.accountType;
    data.firstName = formData.firstName;
    data.lastName = formData.lastName;
    data.email = formData.email;

    // return navigate(ROUTES.AUTH.VERIFY_OTP);

    mutate(data);
  };
  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <fieldset disabled={isPending || OTPMutaion.isPending}>
          <>
            <fieldset disabled={verify}>
              <div className="row mb-4 g-3">
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <label
                    htmlFor="accountType"
                    className="form-label text-capitalize required"
                  >
                    Account Type
                  </label>
                  <select
                    id="accountType"
                    className={`form-select ${
                      errors?.accountType && "is-invalid"
                    }`}
                    {...register("accountType", {
                      required: {
                        value: true,
                        message: "Required Field",
                      },
                    })}
                  >
                    <option value="">Select Account Type</option>
                    {ACCOUNT_TYPES?.map((item) => (
                      <option key={item.name} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    {errors?.accountType && errors?.accountType.message}
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6">
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
                <div className="col-sm-12 col-md-12 col-lg-6">
                  <label
                    htmlFor="lastName"
                    className="form-label text-capitalize"
                  >
                    last name
                  </label>
                  <div class="input-group ">
                    <input
                      type="text"
                      id="lastName"
                      className={`form-control ${
                        errors?.lastName && "is-invalid"
                      }`}
                      {...register("lastName", {})}
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
                      className={`form-control ${
                        errors?.email && "is-invalid"
                      }`}
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
            </fieldset>

            <div className="alert alert-warning">
              Please confirm your email. It will be used for verification
              purposes.
            </div>

            {verify && (
              <div className="col-sm-12 col-md-12 col-lg-12 my-4">
                <label
                  htmlFor="otp"
                  className="form-label text-capitalize required"
                >
                  Enter OTP
                </label>
                <div class="input-group ">
                  <input
                    type="text"
                    id="otp"
                    className={`form-control ${errors?.otp && "is-invalid"}`}
                    {...register("otp", {
                      required: {
                        value: true,
                        message: "Required Field",
                      },
                      pattern: {
                        value: /^\d{6}$/,
                        message: "Enter Valid OTP",
                      },
                    })}
                  />
                  <div className="invalid-feedback">
                    {errors.otp && errors.otp.message}
                  </div>
                </div>
              </div>
            )}
          </>

          <Section className={"mt-4"}>
            <Button
              loading={isPending || OTPMutaion.isPending}
              className="btn btn-primary btn-lg w-100"
              text={verify ? "Verify OTP" : "Submit"}
              type="submit"
            />
            <Button
              className="btn btn-link w-100 mt-4"
              text={"Login"}
              type="button"
              onClick={() => navigate(ROUTES.AUTH.LOGIN)}
            />
          </Section>
        </fieldset>
      </form>
    </>
  );
};

export default UserRegisterForm;
