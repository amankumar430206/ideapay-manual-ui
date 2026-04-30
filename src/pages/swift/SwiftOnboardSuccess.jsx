import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { RefreshCcw, RefreshCw, Search } from "react-feather";
import Skeleton from "react-loading-skeleton";
import { ActionMenu } from "../../components/ActionMenu";
import { PageContent } from "../../components/PageContent";
import { Section } from "../../components/Section";
import { Button, ButtonGroup } from "../../components/buttons/Button";
import { StatsCard } from "../../components/cards/statsCard";
import { Data, Row, Table } from "../../components/table/table";
import { SignatureCapture } from "../../components/SignatureCapture";
import { COUNTRIES } from "../../consts/countries";

import TermsAndConditions from "../../static/relay_aggreement.pdf";

import { useSelector } from "react-redux";

import { toast } from "react-toastify";
import { DisplayDataColumn } from "../../components/DisplayData";
import { SectionHeader } from "../../components/SectionHeader";
import { Spinner } from "../../components/spinner";
import { useUser } from "../../hooks/useUser";
import { useForm } from "react-hook-form";
import { SwiftRegister } from "../../api/api-service";

export const SwiftOnboardingPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const currentUser = useSelector((s) => s.auth.currentUser);
  const [isAccepted, setisAccepted] = useState(false);
  const [signature, setSignature] = useState(null);

  const SwiftRegisterMutation = useMutation({
    mutationFn: SwiftRegister,
    onSuccess: (res) => {
      if (res.success) {
        reset();
      }
    },
    onError: () => {},
  });

  const handleFormSubmit = (formData) => {
    if (!signature)
      return toast("Please provide digital signature, to proceed", {
        type: "error",
      });

    SwiftRegisterMutation.mutate({
      userId: currentUser?._id,
      ...formData,
      signature,
    });
  };

  const user = useUser({ id: currentUser?._id, populate: "businessDetails" });
  if (user.isLoading) return <Spinner text={"Fetching Details.."} />;

  if (currentUser?.isSwift) return <AlreadyPartner />;

  return (
    <PageContent>
      {/* Page Header */}
      <Section>
        <div className="d-flex justify-content-center align-items-center my-5">
          <h3 className="fw-light">Swift Partner Onboarding</h3>
        </div>
      </Section>

      <Section>
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <Section>
              <div className="alert alert-warning">
                <b>Note : </b>
                The following undertaking is provided by
                <b>{` ${currentUser?.firstName} ${currentUser?.lastName}`}</b>,
                as verification of my identity as defined and described in
                Articles 2 thru 5 of the Due Diligence Convention, the Federal
                Banking Commission Circular of December 1991, which deals with
                the prevention of money laundering, and Article 305 of the Swiss
                Criminal Code. The nature and origin of the funds owned by me or
                the corporate entity under my control are forthrightly and
                honestly described and defined herein. The preparer of this
                information sheet requests all recipients of this document to
                affirm to protect the confidentiality of the information.
              </div>
            </Section>
            <SectionHeader title={"Client Details"} />
            <Section>
              <DisplayDataColumn
                data={[
                  {
                    text: "Client ID",
                    value: `${currentUser?.userId}`,
                  },
                  {
                    text: "Client Name",
                    value: `${currentUser?.firstName} ${currentUser?.lastName}`,
                  },
                ]}
              />
            </Section>

            <Section>
              {user?.data?.content.accountType !== "personal" && (
                <>
                  <SectionHeader title={"Business Details"} />
                  <DisplayDataColumn
                    data={[
                      {
                        text: "business name",
                        value:
                          user.data?.content?.businessDetails?.businessName,
                      },
                      {
                        text: "business email",
                        value: user.data?.content?.email,
                      },
                      {
                        text: "business trade name",
                        value:
                          user.data?.content?.businessDetails
                            ?.businessTradeName,
                      },
                      {
                        text: "business type",
                        value:
                          user.data?.content?.businessDetails?.businessType,
                      },
                      {
                        text: "business number",
                        value:
                          user.data?.content?.businessDetails?.businessNumber,
                      },
                      {
                        text: "business PAN / GST",
                        value:
                          user.data?.content?.businessDetails?.businessPANGST,
                      },
                      {
                        text: "business contact",
                        value:
                          user.data?.content?.businessDetails?.businessContact,
                      },
                    ]}
                  />
                </>
              )}
            </Section>

            <Section>
              <SectionHeader title={"Business Address Details"} />
              <DisplayDataColumn
                data={[
                  {
                    text: "address line 1",
                    value: user.data?.content?.businessDetails?.address1,
                  },
                  {
                    text: "address line 2",
                    value: user.data?.content?.businessDetails?.address2
                      ? user.data?.content?.businessDetails?.address2
                      : "-",
                  },
                  {
                    text: "state",
                    value: user.data?.content?.businessDetails?.state,
                  },
                  {
                    text: "city",
                    value: user.data?.content?.businessDetails?.city,
                  },
                  {
                    text: "country",
                    value: user.data?.content?.businessDetails?.country,
                  },
                  {
                    text: "ZIPCODE",
                    value: user.data?.content?.businessDetails?.zipcode,
                  },
                ]}
              />
            </Section>

            <Section>
              <SectionHeader title={"Business Documents"} />
              <DisplayDataColumn
                data={[
                  {
                    text: "KYC document",
                    value: (
                      <>
                        {user.data?.content?.businessDetails?.documents
                          ?.kycDocument && (
                          <a
                            href={
                              user.data?.content?.businessDetails?.documents
                                ?.kycDocument
                            }
                            target="_blank"
                          >
                            View Document
                          </a>
                        )}
                      </>
                    ),
                  },
                  {
                    text: "Inc. Certificate",
                    value: (
                      <>
                        {user.data?.content?.businessDetails?.documents
                          ?.incCertificate && (
                          <a
                            className="disabled"
                            href={
                              user.data?.content?.businessDetails?.documents
                                ?.incCertificate
                            }
                            target="_blank"
                          >
                            View Document
                          </a>
                        )}
                      </>
                    ),
                  },
                ]}
              />
            </Section>

            <Section>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <fieldset>
                  <>
                    <div className="row mb-4 g-3">
                      <div className="col-sm-12 col-md-12 col-lg-12">
                        <label
                          htmlFor="citizenship"
                          className="form-label text-capitalize required"
                        >
                          citizenship
                        </label>
                        <select
                          id="citizenship"
                          className={`form-select ${
                            errors?.citizenship && "is-invalid"
                          }`}
                          {...register("citizenship", {
                            required: {
                              value: true,
                              message: "Required Field",
                            },
                          })}
                        >
                          <option value=""></option>
                          {COUNTRIES?.map((item) => (
                            <option key={item.name} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        <div className="invalid-feedback">
                          {errors?.citizenship && errors?.citizenship.message}
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12">
                        <label
                          htmlFor="passportNumber"
                          className="form-label text-capitalize required"
                        >
                          passport no.
                        </label>
                        <input
                          type="text"
                          id="passportNumber"
                          className={`form-control ${
                            errors?.passportNumber && "is-invalid"
                          }`}
                          {...register("passportNumber", {
                            required: {
                              value: true,
                              message: "Required Field",
                            },
                          })}
                        />
                        <div className="invalid-feedback">
                          {errors.passportNumber &&
                            errors.passportNumber.message}
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12">
                        <label
                          htmlFor="federalNumber"
                          className="form-label text-capitalize"
                        >
                          federal ID no.
                        </label>
                        <input
                          type="text"
                          id="federalNumber"
                          className={`form-control ${
                            errors?.federalNumber && "is-invalid"
                          }`}
                          {...register("federalNumber", {})}
                        />
                        <div className="invalid-feedback">
                          {errors.federalNumber && errors.federalNumber.message}
                        </div>
                      </div>
                    </div>
                  </>

                  <div className="alert alert-info">
                    <p className="fw-bold">Declaration</p>I hereby swear under
                    penalty of perjury, that I AM THE SIGNATORY of the account
                    and the information provided herein is accurate and true.
                    All monies engaged in this transaction are derived from
                    non-criminal origin and are good, clean and cleared. The
                    origin of funds is in compliance with Anti-Money-Laundering
                    Policies as set forth by the Financial Action task Force
                    (FATF) 6/01.
                  </div>

                  <Section className={"mt-5"}>
                    <h6>Terms and Conditions</h6>
                    <div className="form-check my-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="agreeCheckbox"
                        onChange={() => setisAccepted(!isAccepted)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="agreeCheckbox"
                      >
                        I agree to the
                        <a
                          className="ms-1"
                          href={TermsAndConditions}
                          target="_blank"
                        >
                          Terms and Conditions
                        </a>
                      </label>
                    </div>

                    {isAccepted && (
                      <>
                        <h6 className="mt-4">Authorized Signature</h6>
                        <SignatureCapture
                          onClear={() => setSignature(null)}
                          onSave={(data) => {
                            setSignature(data);
                          }}
                        />

                        <Section className={"mt-3"}>
                          <ButtonGroup>
                            <Button
                              className="btn btn-primary"
                              text={"Confirm & Submit"}
                              type="submit"
                            />
                          </ButtonGroup>
                        </Section>
                      </>
                    )}
                  </Section>
                </fieldset>
              </form>
            </Section>
          </div>
        </div>
      </Section>
    </PageContent>
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

export default SwiftOnboardingPage;
