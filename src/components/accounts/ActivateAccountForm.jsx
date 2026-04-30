import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  RequestAccountActivation,
  UploadAccActivationReceipt,
} from "../../api/api-service";
import { ROLES } from "../../consts/AppRoles";
import { OPERATION_COUNTRIES_BANKS } from "../../consts/banks";
import {
  CRYPTO_DETIALS,
  CURRENCY_TYPES,
  OPERATION_COUNTRIES,
  RBP_BANK_DETAILS,
} from "../../consts/formValues";
import { useAccounts } from "../../hooks/useAccounts";
import { generateAccountActivationPdf } from "../../utils/jsonToPdf";
import { DisplayDataColumn } from "../DisplayData";
import { Section } from "../Section";
import { SectionHeader } from "../SectionHeader";
import { Button, ButtonGroup } from "../buttons/Button";
import { Spinner } from "../spinner";

export const ActivateAccountForm = ({ data, onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      account: data?._id || "",
      referenceNo: data?.accountNo || "CUS-",
    },
  });

  const selectedCountry = watch("country");
  const selectedCurrencyType = watch("currencyType");
  const selectedAccount = watch("account");

  const isCurrencyCrypto = selectedCurrencyType === "crypto";

  const [pdfFile, setPdfFile] = useState(null);

  const currentUser = useSelector((s) => s.auth.currentUser);

  const query = useAccounts({
    query: {
      user: currentUser?.role === ROLES.USER ? currentUser?._id : "",
    },
    populate: "user",
  });

  const Mutation = useMutation({
    mutationFn: RequestAccountActivation,
    onSuccess: (res) => {
      toast(res.message, {
        type: "success",
      });
      onClose();
    },
    onError: () => onClose(),
  });

  const UploadReceiptMutation = useMutation({
    mutationFn: UploadAccActivationReceipt,
    onSuccess: (res) => {
      toast(res.message, {
        type: "success",
      });
      onClose();
    },
    onError: () => onClose(),
  });

  const getSelectedAccount = (id) =>
    query.data?.content.find((i) => i._id === id);

  const handleAccountSelect = (id) => {
    setValue("referenceNo", `CUS-${getSelectedAccount(id)?.accountNo}`, {
      shouldValidate: true,
    });
  };

  const GeneratePDfMutation = useMutation({
    mutationFn: generateAccountActivationPdf,
    onSuccess: (res) => {
      setPdfFile(res);
      toast("Document Generated Successfully. Please Confirm & Proceed!", {
        type: "success",
      });
    },
    onError: () => {
      toast("Error While Processing Document!", {
        type: "error",
      });
      setPdfFile(null);
    },
  });

  const handleDownloadPdf = () => {
    const payload = {};
    payload["BANK NAME"] = OPERATION_COUNTRIES_BANKS[selectedCountry].bankName;
    payload["SWIFT CODE"] =
      OPERATION_COUNTRIES_BANKS[selectedCountry].swiftCode;
    payload["BENEFICIARY ACCOUNT NAME"] =
      OPERATION_COUNTRIES_BANKS[selectedCountry].benficiaryAccName;
    payload["BENEFICIARY ACCOUNT NUMBER"] =
      OPERATION_COUNTRIES_BANKS[selectedCountry].benficiaryAccNo;
    payload["ULTIMATE BENEFICIARY ACCOUNT NAME"] =
      RBP_BANK_DETAILS.ultimateBenficiaryAccName;
    payload["ULTIMATE BENEFICIARY ACCOUNT NUMBER"] =
      RBP_BANK_DETAILS.ultimateBenficiaryAccNo;
    payload["PURPOSE CODE"] = RBP_BANK_DETAILS.purposeCode;

    payload["ACCOUNT NUMBER"] = getSelectedAccount(selectedAccount)?.accountNo;
    payload["REFERENCE NUMBER"] = getValues("referenceNo");
    payload["COUNTRY"] = getValues("country")?.toUpperCase();
    payload["AMOUNT"] = getValues("amount")?.toUpperCase();

    GeneratePDfMutation.mutate({
      jsonData: payload,
    });
  };

  const handleFormSubmit = (formData) => {
    const payload = new FormData();

    if (!pdfFile)
      return toast("Please Preview PDF Activation Document!", {
        type: "error",
      });

    if (currentUser?.role === ROLES.ADMIN) {
      payload.append("status", "active");
      payload.append("approvedBy", currentUser?._id);
    }

    payload.append("requestedBy", currentUser?._id);
    payload.append("account", formData.account);
    payload.append("country", formData.country);
    payload.append("referenceNo", formData.referenceNo);
    payload.append("documentPdf", pdfFile, "AccountActivationDocument.pdf");
    payload.append("documentTxt", "");

    Mutation.mutate(payload);
  };

  if (query.isLoading) return <Spinner />;

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <fieldset
          disabled={Mutation.isPending || UploadReceiptMutation.isPending}
        >
          <Section>
            <div className="alert alert-warning">
              Please choose the account and select bank account as per your
              country and transfer USD 5000 for account activation
            </div>
          </Section>
          <div className="row mb-4 g-3">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <div className="">
                <label
                  htmlFor="account"
                  className="form-label text-capitalize required"
                >
                  Account
                </label>
                <select
                  id="account"
                  className={`form-select ${errors?.account && "is-invalid"}`}
                  {...register("account", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                    onChange: (e) => handleAccountSelect(e.target.value),
                  })}
                >
                  <option value="">Select Account</option>
                  {query.data?.content?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item?.accountNo} - {item?.user?.firstName}{" "}
                      {item?.user?.lastName}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">
                  {errors?.account && errors?.account.message}
                </div>
              </div>
            </div>

            <>
              {selectedAccount && (
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <div className="">
                    <label
                      htmlFor="country"
                      className="form-label text-capitalize required"
                    >
                      country
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
                        disabled: query.isLoading,
                      })}
                    >
                      <option value="">Select Country</option>
                      {OPERATION_COUNTRIES?.map((item) => (
                        <option key={item.iso2} value={item.iso2}>
                          {item.name} ({item.iso2})
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">
                      {errors?.country && errors?.country.message}
                    </div>
                  </div>
                </div>
              )}

              {selectedCountry && (
                <>
                  <div className="col-sm-12 col-md-12 col-lg-12">
                    <div className="">
                      <label
                        htmlFor="currencyType"
                        className="form-label text-capitalize required"
                      >
                        currencyType
                      </label>
                      <select
                        id="currencyType"
                        className={`form-select ${
                          errors?.currencyType && "is-invalid"
                        }`}
                        {...register("currencyType", {
                          required: {
                            value: true,
                            message: "Required Field",
                          },
                          disabled: query.isLoading,
                        })}
                      >
                        <option value="">Select Currency Type</option>
                        {CURRENCY_TYPES?.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <div className="invalid-feedback">
                        {errors?.currencyType && errors?.currencyType.message}
                      </div>
                    </div>
                  </div>
                  {selectedCurrencyType === "flat" ? (
                    <Section>
                      <SectionHeader title={"receiving bank details"} />
                      <DisplayDataColumn
                        data={[
                          {
                            text: "bank name",
                            value:
                              OPERATION_COUNTRIES_BANKS[selectedCountry]
                                .bankName || "-",
                          },
                          {
                            text: "swift code",
                            value:
                              OPERATION_COUNTRIES_BANKS[selectedCountry]
                                .swiftCode || "-",
                          },
                          {
                            text: "benficiary account name",
                            value:
                              OPERATION_COUNTRIES_BANKS[selectedCountry]
                                .benficiaryAccName || "-",
                          },
                          {
                            text: "beneficiary account no.",
                            value:
                              OPERATION_COUNTRIES_BANKS[selectedCountry]
                                .benficiaryAccNo || "-",
                          },
                          {
                            text: "ultimate beneficiary account name",
                            value: RBP_BANK_DETAILS.ultimateBenficiaryAccName,
                          },
                          {
                            text: "ultimate beneficiary account code",
                            value: RBP_BANK_DETAILS.ultimateBenficiaryAccNo,
                          },
                          {
                            text: "purpose code for tranfer",
                            value: RBP_BANK_DETAILS.purposeCode,
                          },
                        ]}
                      />
                    </Section>
                  ) : isCurrencyCrypto ? (
                    <Section>
                      <SectionHeader title={"receiving bank details"} />
                      <DisplayDataColumn
                        data={[
                          {
                            text: "wallet address",
                            value: CRYPTO_DETIALS.walletAddress,
                          },
                          {
                            text: "Type",
                            value: CRYPTO_DETIALS.type,
                          },
                        ]}
                      />
                    </Section>
                  ) : null}

                  <div className="col-sm-12 col-md-12 col-lg-12">
                    <label
                      htmlFor="amount"
                      className="form-label text-capitalize"
                    >
                      Amount
                    </label>
                    <div class="input-group ">
                      <input
                        type="text"
                        id="amount"
                        value={isCurrencyCrypto ? "USDT 5000" : "USD 5000"}
                        className={`form-control disabled ${
                          errors?.amount && "is-invalid"
                        }`}
                        {...register("amount", {})}
                      />
                      <div className="invalid-feedback">
                        {errors.amount && errors.amount.message}
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-12 col-lg-12">
                    <label
                      htmlFor="referenceNo"
                      className="form-label text-capitalize required"
                    >
                      Reference No.
                    </label>
                    <div class="input-group ">
                      <input
                        type="text"
                        id="referenceNo"
                        className={`form-control ${
                          errors?.referenceNo && "is-invalid"
                        }`}
                        {...register("referenceNo", {
                          required: "Required Field",
                        })}
                      />
                      <div className="invalid-feedback">
                        {errors.referenceNo && errors.referenceNo.message}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          </div>

          <>
            {pdfFile && (
              <Section>
                <div className="alert alert-warning">
                  You have generated reciept successfully, please click and
                  confirm below to proceed for account activation.
                </div>
              </Section>
            )}

            {selectedAccount && selectedCountry && (
              <Section className={"mt-4"}>
                <Section className={"mt-4"}>
                  <ButtonGroup>
                    {!pdfFile && (
                      <>
                        <Button
                          loading={GeneratePDfMutation.isPending}
                          className="btn btn-primary"
                          text={"Download & Share Receipt"}
                          onClick={handleDownloadPdf}
                          type="button"
                        />

                        <Button
                          className="btn btn-light"
                          text={"Cancel"}
                          onClick={onClose}
                          type="button"
                        />
                      </>
                    )}

                    {pdfFile && (
                      <>
                        <Button
                          loading={Mutation.isPending}
                          className="btn btn-primary"
                          text={"Confirm & Proceed"}
                          type="submit"
                        />

                        <Button
                          className="btn btn-light"
                          text={"Cancel"}
                          onClick={onClose}
                          type="button"
                        />
                      </>
                    )}
                  </ButtonGroup>
                </Section>
              </Section>
            )}
          </>
        </fieldset>
      </form>
    </>
  );
};
