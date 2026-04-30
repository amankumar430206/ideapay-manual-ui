import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Section } from "../Section";
import { DisplayDataColumn } from "../DisplayData";
import { SectionHeader } from "../SectionHeader";
import { Button, ButtonGroup } from "../buttons/Button";

export const TransferCardFundForm = ({ data, onClose }) => {
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
            <div className="col-sm-12 col-md-12 col-lg-12">
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
            <div className="col-sm-12 col-md-12 col-lg-12">
              <div className="">
                <label
                  htmlFor="account_to"
                  className="form-label text-capitalize required"
                >
                  Credit To
                </label>
                <select
                  id="account_to"
                  className={`form-select ${
                    errors?.account_to && "is-invalid"
                  }`}
                  {...register("account_to", {
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
                  {errors?.account_to && errors?.account_to.message}
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-12 col-lg-12">
              <label
                htmlFor="amount"
                className="form-label text-capitalize required"
              >
                Amount to transfer
              </label>
              <div class="input-group ">
                <span class="input-group-text">USD</span>
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
            <div className="col-sm-12 col-md-12 col-lg-12">
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
                    message: "Required Field",
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
