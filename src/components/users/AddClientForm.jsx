import React from "react";
import { Button, ButtonGroup } from "../buttons/Button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ROUTES } from "../../router/routes";
import { ACCOUNT_TYPES, BUSINESS_TYPES } from "../../consts/formValues";
import { COUNTRIES } from "../../consts/countries";
import { UserRegister } from "../../api/api-service";
import { SectionHeader } from "../SectionHeader";
import { Section } from "../Section";

const UserRegisterForm = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const accountType = watch("accountType");

  const { isPending, mutate } = useMutation({
    mutationFn: UserRegister,
    onSuccess: (res) => {
      if (res.success) {
        console.log(res);
        reset();
        onClose();
      }
    },
    onError: () => {},
  });

  const validateFileSize = (value) => {
    const file = value[0];
    if (!file) return;

    const fileSize = file.size / 1024; // Size in KB
    const maxSize = 2048; // Maximum size allowed in KB (2 MB)

    return (
      fileSize <= maxSize || "File size exceeds maximum allowed size (2 MB)"
    );
  };

  const handleFormSubmit = (formData) => {
    // check for balance and  available funds in the account, before transfer
    const data = new FormData();
    data.append("accountType", formData.accountType);
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);

    // business details
    data.append("businessName", formData.businessName);
    data.append("businessTradeName", formData.businessTradeName);
    data.append("businessType", formData.businessType);
    data.append("businessNumber", formData.businessNumber);
    data.append("businessContact", formData.businessContact);
    data.append("businessPANGST", formData.businessPANGST);
    data.append("website", formData.website);
    data.append("about", formData.businessDescription);

    // business address details
    data.append("country", formData.country);
    data.append("city", formData.city);
    data.append("state", formData.state);
    data.append("zipcode", formData.zipcode);
    data.append("address1", formData.address1);
    data.append("address2", formData.address2);

    // business documents
    data.append("kycDocument", formData.kycDocument[0]);
    data.append("incCertificate", formData.incCertificate[0]);

    mutate(data);
  };
  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <fieldset disabled={isPending}>
          <>
            <SectionHeader title={"Personal Details"} />
            <div className="row mb-4 g-3">
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
              <div className="col-sm-12 col-md-12 col-lg-6">
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
          </>

          {/* business details */}
          {accountType !== "personal" && (
            <>
              <SectionHeader title={"Business Details"} />
              <div className="row mb-4 g-3">
                <div className="col-sm-12 col-md-12 col-lg-6">
                  <label
                    htmlFor="businessName"
                    className="form-label text-capitalize required"
                  >
                    Business Name (legal)
                  </label>
                  <div class="input-group ">
                    <input
                      type="text"
                      id="businessName"
                      className={`form-control ${
                        errors?.businessName && "is-invalid"
                      }`}
                      {...register("businessName", {
                        required: {
                          value: true,
                          message: "Required Field",
                        },
                      })}
                    />
                    <div className="invalid-feedback">
                      {errors.businessName && errors.businessName.message}
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6">
                  <label
                    htmlFor="businessTradeName"
                    className="form-label text-capitalize required"
                  >
                    Business Trade Name (DBA)
                  </label>
                  <div class="input-group ">
                    <input
                      type="text"
                      id="businessTradeName"
                      className={`form-control ${
                        errors?.businessTradeName && "is-invalid"
                      }`}
                      {...register("businessTradeName", {
                        required: {
                          value: true,
                          message: "Required Field",
                        },
                      })}
                    />
                    <div className="invalid-feedback">
                      {errors.businessTradeName &&
                        errors.businessTradeName.message}
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6">
                  <label
                    htmlFor="businessType"
                    className="form-label text-capitalize required"
                  >
                    business type
                  </label>
                  <select
                    id="businessType"
                    className={`form-select ${
                      errors?.businessType && "is-invalid"
                    }`}
                    {...register("businessType", {
                      required: {
                        value: true,
                        message: "Required Field",
                      },
                    })}
                  >
                    <option value=""></option>
                    {BUSINESS_TYPES?.map((item) => (
                      <option key={item.name} value={item.shortname}>
                        {item.name} ({item.shortname})
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    {errors?.businessType && errors?.businessType.message}
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6">
                  <label
                    htmlFor="businessNumber"
                    className="form-label text-capitalize required"
                  >
                    business Number
                  </label>
                  <div class="input-group ">
                    <input
                      type="text"
                      id="businessNumber"
                      className={`form-control ${
                        errors?.businessNumber && "is-invalid"
                      }`}
                      {...register("businessNumber", {
                        required: {
                          value: true,
                          message: "Required Field",
                        },
                      })}
                    />
                    <div className="invalid-feedback">
                      {errors.businessNumber && errors.businessNumber.message}
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6">
                  <label
                    htmlFor="businessContact"
                    className="form-label text-capitalize required"
                  >
                    business Contact
                  </label>
                  <div class="input-group ">
                    <input
                      type="text"
                      id="businessContact"
                      className={`form-control ${
                        errors?.businessContact && "is-invalid"
                      }`}
                      {...register("businessContact", {
                        required: {
                          value: true,
                          message: "Required Field",
                        },
                      })}
                    />
                    <div className="invalid-feedback">
                      {errors.businessContact && errors.businessContact.message}
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6">
                  <label
                    htmlFor="businessPANGST"
                    className="form-label text-capitalize"
                  >
                    business PAN / GST
                  </label>
                  <div class="input-group ">
                    <input
                      type="text"
                      id="businessPANGST"
                      className={`form-control ${
                        errors?.businessPANGST && "is-invalid"
                      }`}
                      {...register("businessPANGST", {})}
                    />
                    <div className="invalid-feedback">
                      {errors.businessPANGST && errors.businessPANGST.message}
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6">
                  <label
                    htmlFor="businessCustomerContact"
                    className="form-label text-capitalize"
                  >
                    customer service Contact
                  </label>
                  <div class="input-group ">
                    <input
                      type="text"
                      id="businessCustomerContact"
                      className={`form-control ${
                        errors?.businessCustomerContact && "is-invalid"
                      }`}
                      {...register("businessCustomerContact", {})}
                    />
                    <div className="invalid-feedback">
                      {errors.businessCustomerContact &&
                        errors.businessCustomerContact.message}
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <label
                    htmlFor="website"
                    className="form-label text-capitalize"
                  >
                    website
                  </label>
                  <div class="input-group ">
                    <input
                      type="text"
                      id="website"
                      className={`form-control ${
                        errors?.website && "is-invalid"
                      }`}
                      {...register("website", {})}
                    />
                    <div className="invalid-feedback">
                      {errors.website && errors.website.message}
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <label
                    htmlFor="businessDescription"
                    className="form-label text-capitalize"
                  >
                    about business
                  </label>
                  <div class="input-group ">
                    <textarea
                      id="businessDescription"
                      maxLength={255}
                      rows={5}
                      className={`form-control ${
                        errors.businessDescription ? "is-invalid" : ""
                      }`}
                      {...register("businessDescription", {})}
                    ></textarea>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* business Address details */}
          <>
            <SectionHeader title={"Business Address Details"} />
            <div className="row mb-4 g-3">
              <div className="col-sm-12 col-md-12 col-lg-6">
                <label
                  htmlFor="country"
                  className="form-label text-capitalize required"
                >
                  Country
                </label>
                <select
                  id="country"
                  className={`form-select ${errors?.country && "is-invalid"}`}
                  {...register("country", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                >
                  <option value="">Select Country</option>
                  {COUNTRIES?.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">
                  {errors?.country && errors?.country.message}
                </div>
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6">
                <label
                  htmlFor="city"
                  className="form-label text-capitalize required"
                >
                  city
                </label>
                <div class="input-group ">
                  <input
                    type="text"
                    id="city"
                    className={`form-control ${errors?.city && "is-invalid"}`}
                    {...register("city", {
                      required: {
                        value: true,
                        message: "Required Field",
                      },
                    })}
                  />
                  <div className="invalid-feedback">
                    {errors.city && errors.city.message}
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6">
                <label
                  htmlFor="state"
                  className="form-label text-capitalize required"
                >
                  state
                </label>
                <div class="input-group ">
                  <input
                    type="text"
                    id="state"
                    className={`form-control ${errors?.state && "is-invalid"}`}
                    {...register("state", {
                      required: {
                        value: true,
                        message: "Required Field",
                      },
                    })}
                  />
                  <div className="invalid-feedback">
                    {errors.state && errors.state.message}
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6">
                <label
                  htmlFor="zipcode"
                  className="form-label text-capitalize required"
                >
                  zip code
                </label>
                <div class="input-group ">
                  <input
                    type="text"
                    id="zipcode"
                    className={`form-control ${
                      errors?.zipcode && "is-invalid"
                    }`}
                    {...register("zipcode", {
                      required: {
                        value: true,
                        message: "Required Field",
                      },
                    })}
                  />
                  <div className="invalid-feedback">
                    {errors.zipcode && errors.zipcode.message}
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-12 col-lg-12">
                <label
                  htmlFor="address1"
                  className="form-label text-capitalize required"
                >
                  address line 1
                </label>
                <div class="input-group ">
                  <input
                    type="text"
                    id="address1"
                    className={`form-control ${
                      errors?.address1 && "is-invalid"
                    }`}
                    {...register("address1", {
                      required: {
                        value: true,
                        message: "Required Field",
                      },
                    })}
                  />
                  <div className="invalid-feedback">
                    {errors.address1 && errors.address1.message}
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-12 col-lg-12">
                <label
                  htmlFor="address2"
                  className="form-label text-capitalize"
                >
                  Address Line 2
                </label>
                <div class="input-group ">
                  <input
                    type="text"
                    id="address2"
                    className={`form-control ${
                      errors?.address2 && "is-invalid"
                    }`}
                    {...register("address2", {})}
                  />
                  <div className="invalid-feedback">
                    {errors.address2 && errors.address2.message}
                  </div>
                </div>
              </div>
            </div>
          </>

          {/* business documents */}
          <>
            <SectionHeader title={"Business Documents"} />
            <div className="row mb-4 g-3">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <label
                  htmlFor="kycDocument"
                  className="form-label text-capitalize"
                >
                  KYC ID Address Proof
                </label>
                <div class="input-group">
                  <input
                    type="file"
                    id="kycDocument"
                    className={`form-control ${
                      errors?.kycDocument && "is-invalid"
                    }`}
                    {...register("kycDocument", {
                      validate: validateFileSize,
                    })}
                  />
                  <div className="invalid-feedback">
                    {errors.kycDocument && errors.kycDocument.message}
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-12 col-lg-12">
                <label
                  htmlFor="incCertificate"
                  className="form-label text-capitalize"
                >
                  incorporation Certificate
                </label>
                <div class="input-group">
                  <input
                    type="file"
                    id="incCertificate"
                    className={`form-control ${
                      errors?.incCertificate && "is-invalid"
                    }`}
                    {...register("incCertificate", {
                      validate: validateFileSize,
                    })}
                  />
                  <div className="invalid-feedback">
                    {errors.incCertificate && errors.incCertificate.message}
                  </div>
                </div>
              </div>
            </div>
          </>

          <Section className={"mt-5"}>
            <ButtonGroup>
              <Button
                loading={isPending}
                className="btn btn-primary"
                text={"Confirm & Submit"}
                type="submit"
              />
              <Button
                className="btn btn-light"
                text={"Cancel"}
                type="button"
                onClick={() => onClose()}
              />
            </ButtonGroup>
          </Section>
        </fieldset>
      </form>
    </>
  );
};

export default UserRegisterForm;
