import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { UserKYCUpdate } from "../../api/api-service";
import { VerifyPassport } from "../../api/surepass-service";
import { COUNTRIES } from "../../consts/countries";
import { BUSINESS_TYPES } from "../../consts/formValues";
import { validateFileSize } from "../../utils/utils";
import { Button, ButtonGroup } from "../buttons/Button";
import { Section } from "../Section";
import { SectionHeader } from "../SectionHeader";
import { toast } from "react-toastify";

const KYCUpdateForm = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const currentUser = useSelector((s) => s.auth.currentUser);
  const [isPassportVerified, setIsPassportVerified] = useState(false);
  const [passportVerifiedData, setPassportVerifiedData] = useState({});

  // watch form documentss
  const kycDocument = watch("kycDocument");

  const { isPending, mutate } = useMutation({
    mutationFn: UserKYCUpdate,
    onSuccess: (res) => {
      if (res.success) {
        reset();
        onClose();
      }
    },
    onError: () => {},
  });

  const VerifiyPassportMutation = useMutation({
    mutationFn: VerifyPassport,
    onSuccess: (res) => {
      if (res.success) {
        setIsPassportVerified(true);
        setPassportVerifiedData(res?.data);
        toast("Passport Verified Successfully!", { type: "success" });
      } else {
        toast(res.message, { type: "error" });
        reset();
      }
    },
    onError: () => {},
  });

  const handleFormSubmit = (formData) => {
    const data = new FormData();

    // handle passport verification
    if (!isPassportVerified) {
      data.append("file", formData.kycDocument[0]);
      return VerifiyPassportMutation.mutate(data);
    }

    if (currentUser?.accountType !== "personal") {
      // business details
      data.append("businessName", formData.businessName);
      data.append("businessType", formData.businessType);
      data.append("businessNumber", formData.businessNumber);
      data.append("businessContact", formData.businessContact);
    }

    // business address details
    data.append("country", formData.country);
    data.append("city", formData.city);
    data.append("state", formData.state);
    data.append("zipcode", formData.zipcode);
    data.append("address1", formData.address1);
    data.append("address2", formData.address2);
    data.append("passport", JSON.stringify(passportVerifiedData));

    // business documents
    data.append("kycDocument", formData.kycDocument[0]);
    data.append("incCertificate", formData.incCertificate[0]);

    data.append("user", currentUser?._id); // only users not admin id
    mutate(data);
  };
  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <fieldset disabled={isPending || VerifiyPassportMutation.isPending}>
          {/* business documents */}
          <>
            <SectionHeader title={"Business Documents"} />
            <div className="row mb-4 g-3">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <label
                  htmlFor="kycDocument"
                  className="form-label text-capitalize required"
                >
                  passport document front side
                </label>
                <div className="form-group">
                  <input
                    type="file"
                    id="kycDocument"
                    className={`form-control ${
                      errors?.kycDocument && "is-invalid"
                    }`}
                    {...register("kycDocument", {
                      required: "document required",
                      validate: validateFileSize,
                    })}
                  />
                  <div className="invalid-feedback text-capitalize">
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
                <div className="form-group">
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

          {!!isPassportVerified && (
            <>
              {currentUser?.accountType !== "personal" && (
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
                      <div className="input-group ">
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
                      <div className="input-group ">
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
                          {errors.businessNumber &&
                            errors.businessNumber.message}
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
                      <div className="input-group ">
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
                          {errors.businessContact &&
                            errors.businessContact.message}
                        </div>
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
                      className={`form-select ${
                        errors?.country && "is-invalid"
                      }`}
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
                    <div className="input-group ">
                      <input
                        type="text"
                        id="city"
                        className={`form-control ${
                          errors?.city && "is-invalid"
                        }`}
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
                    <div className="input-group ">
                      <input
                        type="text"
                        id="state"
                        className={`form-control ${
                          errors?.state && "is-invalid"
                        }`}
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
                    <div className="input-group ">
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
                    <div className="input-group ">
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
                    <div className="input-group ">
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
            </>
          )}

          <Section className={"mt-5"}>
            <ButtonGroup>
              <Button
                loading={isPending || VerifiyPassportMutation.isPending}
                className="btn btn-primary"
                text={
                  isPassportVerified ? "Confirm & Submit" : "Verify Passport"
                }
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

export default KYCUpdateForm;
