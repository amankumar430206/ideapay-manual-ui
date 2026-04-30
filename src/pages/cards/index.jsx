import { useMutation } from "@tanstack/react-query";
import React from "react";
import { PageContent } from "../../components/PageContent";
import { Section } from "../../components/Section";
import { Button, ButtonGroup } from "../../components/buttons/Button";
import {
  CARDS_RANGE,
  PRODUCT_OFFERS_CLIENTS,
  YES_NO,
} from "../../consts/formValues";

import { useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import { RequestCard } from "../../api/api-service";
import { SectionHeader } from "../../components/SectionHeader";
import CreditCard from "../../components/card/CardComponent";
import { DisplayData } from "../../components/DisplayData";

export const CardsPage = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  const cardHolderName = `${currentUser?.firstName} ${currentUser?.lastName}`;

  return (
    <>
      <PageContent>
        {/* Page Header */}
        <Section>
          <h2 className="text-center my-5">Card Issuance</h2>
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="row g-5">
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="card border-0">
                    <div className="card-body">
                      <CreditCard
                        companyName="MyntPe"
                        cardNumber="1234 5678 9012 3456"
                        cardHolder={cardHolderName}
                        expiryDate="01/27"
                      />
                      <h3 className="card-title mt-4">Virtual Card</h3>
                      <div className="my-4">
                        <DisplayData
                          data={[
                            {
                              text: "application fee",
                              value: "7 USD",
                            },
                            {
                              text: "monthly limit",
                              value: "5000 USD",
                            },
                            {
                              text: "monthly fee",
                              value: "1 USD",
                            },
                            {
                              text: "recharge fee",
                              value: "2.5 %",
                            },
                          ]}
                        />
                      </div>
                      <a href="#" className="btn btn-light btn-lg w-100">
                        Apply Virtual Card
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <div className="card border-0">
                    <div className="card-body">
                      <CreditCard
                        companyName="MyntPe"
                        cardNumber="1234 5678 9012 3456"
                        cardHolder={cardHolderName}
                        expiryDate="01/29"
                      />
                      <h3 className="card-title mt-4">Physical Card</h3>
                      <div className="my-4">
                        <DisplayData
                          data={[
                            {
                              text: "application fee",
                              value: "140 EUR",
                            },
                            {
                              text: "monthly limit",
                              value: "5000 EUR",
                            },
                            {
                              text: "monthly fee",
                              value: "1 EUR",
                            },
                            {
                              text: "recharge fee",
                              value: "2.1 %",
                            },
                          ]}
                        />
                      </div>
                      <a
                        href="#"
                        className="btn btn-outline-primary btn-lg w-100"
                      >
                        Apply Physical Card
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </PageContent>
    </>
  );
};

const CardIssuance = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const currentUser = useSelector((s) => s.auth.currentUser);

  const Mutation = useMutation({
    mutationFn: RequestCard,
    onSuccess: (res) => {
      if (res.success) {
        reset();
      }
    },
    onError: () => {},
  });

  const handleFormSubmit = (formData) => {
    const payload = {
      requestedBy: currentUser?._id,
      details: formData,
    };
    console.log(payload);

    Mutation.mutate(payload);
  };

  return (
    <>
      <div className="col-lg-7">
        <Section
          className={"text-center bg-primary text-light py-5 rounded-3 mt-5"}
        >
          <div className="d-flex justify-content-center align-items-center">
            <h3 className="">Card Issuance</h3>
          </div>
        </Section>

        <SectionHeader title={"Questionaire"} />
        <Section>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <fieldset>
              <div className="row mb-4 g-4">
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <label
                    htmlFor="isLicensed"
                    className="form-label text-capitalize required"
                  >
                    Are you a licensed financial institution?
                  </label>
                  <select
                    id="isLicensed"
                    className={`form-select ${
                      errors?.isLicensed && "is-invalid"
                    }`}
                    {...register("isLicensed", {
                      required: {
                        value: true,
                        message: "Required Field",
                      },
                    })}
                  >
                    <option value="">Select Option</option>
                    {YES_NO?.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    {errors?.isLicensed && errors?.isLicensed.message}
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <label
                    htmlFor="offerPlanning"
                    className="form-label text-capitalize required"
                  >
                    Do you plan to offer our products to your direct employees,
                    contractors or clients (individuals), or do you plan to
                    offer them to other businesses?
                  </label>
                  <select
                    id="offerPlanning"
                    className={`form-select ${
                      errors?.offerPlanning && "is-invalid"
                    }`}
                    {...register("offerPlanning", {
                      required: {
                        value: true,
                        message: "Required Field",
                      },
                    })}
                  >
                    <option value=""></option>
                    {PRODUCT_OFFERS_CLIENTS?.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    {errors?.offerPlanning && errors?.offerPlanning.message}
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <label
                    htmlFor="offerPlanningReason"
                    className="form-label text-capitalize required"
                  >
                    Please explain how you plan to offer our products to other
                    businesses.
                  </label>
                  <textarea
                    id="offerPlanningReason"
                    className={`form-control ${
                      errors?.offerPlanningReason && "is-invalid"
                    }`}
                    {...register("offerPlanningReason", {
                      required: {
                        value: false,
                        message: "Required Field",
                      },
                    })}
                  ></textarea>
                  <div className="invalid-feedback">
                    {errors?.offerPlanningReason &&
                      errors?.offerPlanningReason.message}
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <label
                    htmlFor="cardRange"
                    className="form-label text-capitalize required"
                  >
                    Please select the range of cards and/​or wallets you
                    anticipate issuing in the first year.
                  </label>
                  <select
                    id="cardRange"
                    className={`form-select ${
                      errors?.cardRange && "is-invalid"
                    }`}
                    {...register("cardRange", {
                      required: {
                        value: true,
                        message: "Required Field",
                      },
                    })}
                  >
                    <option value=""></option>
                    {CARDS_RANGE?.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    {errors?.cardRange && errors?.cardRange.message}
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <label
                    htmlFor="isDigitailCurrency"
                    className="form-label text-capitalize required"
                  >
                    Do you (or your client) handle digital currencies?
                  </label>
                  <select
                    id="isDigitailCurrency"
                    className={`form-select ${
                      errors?.isDigitailCurrency && "is-invalid"
                    }`}
                    {...register("isDigitailCurrency", {
                      required: {
                        value: true,
                        message: "Required Field",
                      },
                    })}
                  >
                    <option value="">Select Option</option>
                    {YES_NO?.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    {errors?.isDigitailCurrency &&
                      errors?.isDigitailCurrency.message}
                  </div>
                </div>

                <SectionHeader title={"Tell Us What Products interest you"} />

                <div className="col-sm-12 col-md-12 col-lg-12">
                  <h6 className="required">Areas of Interest</h6>
                  <div className="form-group">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value={"Card Issuance (i.e. prepaid, credit)"}
                        {...register("interestAreas", {
                          required: {
                            value: true,
                            message: "Required Field",
                          },
                        })}
                        id="cardCheckbox"
                      />
                      <label class="form-check-label" for="cardCheckbox">
                        Card Issuance (i.e. prepaid, credit)
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        {...register("interestAreas", {
                          required: {
                            value: true,
                            message: "Required Field",
                          },
                        })}
                        id="walletCheckbox"
                        value={" Wallet Solutions and Treasury Management"}
                      />
                      <label class="form-check-label" for="walletCheckbox">
                        Wallet Solutions and Treasury Management
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        {...register("interestAreas", {
                          required: {
                            value: true,
                            message: "Required Field",
                          },
                        })}
                        id="layaltyCheckbox"
                        value={"Loyalty, Rewards and Benefits"}
                      />
                      <label class="form-check-label" for="layaltyCheckbox">
                        Loyalty, Rewards and Benefits
                      </label>
                    </div>
                    <div className="invalid-feedback">
                      {errors.passportNumber && errors.passportNumber.message}
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <label
                    htmlFor="liveDate"
                    className="form-label text-capitalize"
                  >
                    Desired Go-Live Date
                  </label>
                  <input
                    type="date"
                    id="liveDate"
                    className={`form-control ${
                      errors?.liveDate && "is-invalid"
                    }`}
                    {...register("liveDate", {})}
                  />
                  <div className="invalid-feedback">
                    {errors.liveDate && errors.liveDate.message}
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <label
                    htmlFor="areasImprovement"
                    className="form-label text-capitalize"
                  >
                    What Need You Are Trying to Solve?
                  </label>
                  <input
                    type="text"
                    id="areasImprovement"
                    className={`form-control ${
                      errors?.areasImprovement && "is-invalid"
                    }`}
                    {...register("areasImprovement", {})}
                  />
                  <div className="invalid-feedback">
                    {errors.areasImprovement && errors.areasImprovement.message}
                  </div>
                </div>
              </div>

              <Section className={"mt-3"}>
                <ButtonGroup>
                  <Button
                    loading={Mutation.isPending}
                    className="btn btn-primary"
                    text={"Confirm & Submit"}
                    type="submit"
                  />
                </ButtonGroup>
              </Section>
            </fieldset>
          </form>
        </Section>
      </div>
    </>
  );
};

const AlreadyPartner = () => {
  return (
    <>
      <PageContent>
        {/* Page Header */}
        <Section>
          <div className="d-flex justify-content-center align-items-center my-5">
            <h3 className="fw-light">Swift Partner Onboarding</h3>
          </div>
        </Section>

        <Section>
          <div className="alert alert-info text-center">
            You are enrolled to swift service.
          </div>
        </Section>
      </PageContent>
    </>
  );
};

export default CardsPage;
