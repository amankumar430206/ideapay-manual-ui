import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Section } from "../Section";
import { DisplayDataColumn } from "../DisplayData";
import { SectionHeader } from "../SectionHeader";
import { Button, ButtonGroup } from "../buttons/Button";
import { COUNTRIES } from "../../consts/countries";

export const TransferOutGoingWireForm = ({ data, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const Mutation = useMutation({
    mutationFn: () => null,
    onSuccess: (res) => {
      toast(res.message, {
        type: "success",
      });
      onClose();
    },
    onError: () => onClose(),
  });
  const handleFormSubmit = (formData) => {
    // check for balance and  available funds in the account, before transfer
    console.log(formData);
  };
  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <fieldset disabled={Mutation.isPending}>
          <div className="row mb-4 g-3">
            <div className="col-sm-12 col-md-12 col-lg-6">
              <div className="">
                <label
                  htmlFor="account_from"
                  className="form-label text-capitalize required"
                >
                  Debit From
                </label>
                <select
                  id="account_from"
                  className={`form-select ${
                    errors?.account_from && "is-invalid"
                  }`}
                  {...register("account_from", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                >
                  {[]?.map((item) => (
                    <option key={item.id} value={item.iso2}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">
                  {errors?.account_from && errors?.account_from.message}
                </div>
              </div>
            </div>

            <SectionHeader title="Beneficiary Bank" />
            <div className="col-sm-12 col-md-12 col-lg-6">
              <label
                htmlFor="bankBIC"
                className="form-label text-capitalize required"
              >
                SWIFT / BIC
              </label>
              <div className="input-group ">
                <input
                  type="text"
                  id="bankBIC"
                  className={`form-control ${errors?.bankBIC && "is-invalid"}`}
                  {...register("bankBIC", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                />
                <div className="invalid-feedback">
                  {errors.bankBIC && errors.bankBIC.message}
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6">
              <label
                htmlFor="bankName"
                className="form-label text-capitalize required"
              >
                Name
              </label>
              <div className="input-group ">
                <input
                  type="text"
                  id="bankName"
                  className={`form-control ${errors?.bankName && "is-invalid"}`}
                  {...register("bankName", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                />
                <div className="invalid-feedback">
                  {errors.bankName && errors.bankName.message}
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6">
              <label
                htmlFor="bankAddress"
                className="form-label text-capitalize required"
              >
                Address
              </label>
              <div className="input-group ">
                <input
                  type="text"
                  id="bankAddress"
                  className={`form-control ${
                    errors?.bankAddress && "is-invalid"
                  }`}
                  {...register("bankAddress", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                />
                <div className="invalid-feedback">
                  {errors.bankAddress && errors.bankAddress.message}
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6">
              <label
                htmlFor="bankLocation"
                className="form-label text-capitalize required"
              >
                Location
              </label>
              <div className="input-group ">
                <input
                  type="text"
                  id="bankLocation"
                  className={`form-control ${
                    errors?.bankLocation && "is-invalid"
                  }`}
                  {...register("bankLocation", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                />
                <div className="invalid-feedback">
                  {errors.bankLocation && errors.bankLocation.message}
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-12 col-lg-6">
              <div class="mb-3">
                <label for="country" class="form-label text-uppercase required">
                  Country
                </label>
                <select
                  id="country"
                  className={`form-select ${errors.country && "is-invalid"}`}
                  {...register("country", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                >
                  <option>Select Country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.name} value={c.iso2}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div class="invalid-feedback">
                  {errors.country && errors.country.message}
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-12 col-lg-6">
              <label
                htmlFor="bankCode"
                className="form-label text-capitalize required"
              >
                ABA/RTN/Sort code
              </label>
              <div className="input-group ">
                <input
                  type="text"
                  id="bankCode"
                  className={`form-control ${errors?.bankCode && "is-invalid"}`}
                  {...register("bankCode", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                />
                <div className="invalid-feedback">
                  {errors.bankCode && errors.bankCode.message}
                </div>
              </div>
            </div>

            <SectionHeader title="Beneficiary Customer" />

            <div className="col-sm-12 col-md-12 col-lg-6">
              <label
                htmlFor="customerName"
                className="form-label text-capitalize required"
              >
                Customer Name
              </label>
              <div className="input-group ">
                <input
                  type="text"
                  id="customerName"
                  className={`form-control ${
                    errors?.customerName && "is-invalid"
                  }`}
                  {...register("customerName", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                />
                <div className="invalid-feedback">
                  {errors.customerName && errors.customerName.message}
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6">
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
                  className={`form-control ${errors?.address1 && "is-invalid"}`}
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

            <div className="col-sm-12 col-md-12 col-lg-6">
              <label
                htmlFor="address2"
                className="form-label text-capitalize required"
              >
                address line 2
              </label>
              <div className="input-group ">
                <input
                  type="text"
                  id="address2"
                  className={`form-control ${errors?.address2 && "is-invalid"}`}
                  {...register("address2", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                />
                <div className="invalid-feedback">
                  {errors.address2 && errors.address2.message}
                </div>
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
                State/Province/Region
              </label>
              <div className="input-group ">
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
              <div class="mb-3">
                <label
                  for="customerCountry"
                  class="form-label text-uppercase required"
                >
                  customerCountry
                </label>
                <select
                  id="customerCountry"
                  className={`form-select ${
                    errors.customerCountry && "is-invalid"
                  }`}
                  {...register("customerCountry", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                >
                  <option>Select Country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.name} value={c.iso2}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div class="invalid-feedback">
                  {errors.customerCountry && errors.customerCountry.message}
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6">
              <label
                htmlFor="customerAccount"
                className="form-label text-capitalize required"
              >
                Acc#/IBAN
              </label>
              <div className="input-group ">
                <input
                  type="text"
                  id="customerAccount"
                  className={`form-control ${
                    errors?.customerAccount && "is-invalid"
                  }`}
                  {...register("customerAccount", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                />
                <div className="invalid-feedback">
                  {errors.customerAccount && errors.customerAccount.message}
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6">
              <label
                for="message"
                className="form-label text-capitalize required"
              >
                Ref message
              </label>
              <textarea
                maxLength={255}
                rows={5}
                className={`form-control ${errors.message ? "is-invalid" : ""}`}
                {...register("message", {
                  required: {
                    value: true,
                    message: "Required Field",
                  },
                })}
              ></textarea>
              <div class="invalid-feedback text-start">
                {errors.message && errors.message.message}
              </div>
            </div>

            <SectionHeader title="Transfer Details" />

            <div className="col-sm-12 col-md-12 col-lg-6">
              <label
                htmlFor="amount"
                className="form-label text-capitalize required"
              >
                Amount To Transfer
              </label>
              <div className="input-group ">
                <input
                  type="text"
                  id="amount"
                  className={`form-control ${errors?.amount && "is-invalid"}`}
                  {...register("amount", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                />
                <div className="invalid-feedback">
                  {errors.amount && errors.amount.message}
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6">
              <label
                htmlFor="currency"
                className="form-label text-capitalize required"
              >
                currency
              </label>
              <div className="input-group ">
                <input
                  type="text"
                  id="currency"
                  className={`form-control ${errors?.currency && "is-invalid"}`}
                  {...register("currency", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                />
                <div className="invalid-feedback">
                  {errors.currency && errors.currency.message}
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-12 col-lg-6">
              <label
                for="description"
                className="form-label text-capitalize required"
              >
                description
              </label>
              <textarea
                maxLength={255}
                rows={5}
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                {...register("description", {
                  required: {
                    value: true,
                    description: "Required Field",
                  },
                })}
              ></textarea>
              <div class="invalid-feedback text-start">
                {errors.description && errors.description.message}
              </div>
            </div>

            <div className="col-sm-12 col-md-12 col-lg-12">
              <label
                htmlFor="otp"
                className="form-label text-capitalize required"
              >
                Verify OTP
              </label>
              <div className="input-group ">
                <span className="input-group-text">OTP</span>
                <input
                  type="text"
                  id="otp"
                  className={`form-control ${errors?.otp && "is-invalid"}`}
                  {...register("otp", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                />
                <div className="invalid-feedback">
                  {errors.otp && errors.otp.message}
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-12">
              <label
                for="document"
                className="form-label text-capitalize required"
              >
                Upload Supporting Documentation
              </label>
              <div className="input-group mb-3">
                <input
                  id="document"
                  type="file"
                  className={`form-control ${
                    errors.document ? "is-invalid" : ""
                  }`}
                  {...register("document", {
                    required: {
                      value: true,
                      message: "please upload document",
                    },
                  })}
                />
                <div className="invalid-feedback text-start">
                  {errors.document && errors.document.message}
                </div>
              </div>
            </div>
          </div>

          <ButtonGroup>
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
            />
          </ButtonGroup>
        </fieldset>
      </form>
    </>
  );
};
