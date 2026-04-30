import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Section } from "../Section";
import { DisplayDataColumn } from "../DisplayData";
import { SectionHeader } from "../SectionHeader";
import { Button, ButtonGroup } from "../buttons/Button";

export const TransferIngoingWireForm = ({ data, onClose }) => {
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
                  {["ACC32434798274"]?.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">
                  {errors?.account_from && errors?.account_from.message}
                </div>
              </div>
            </div>
          </div>

          <Section>
            <div className="alert alert-info">
              Please fund your account using the following bank instructions:
            </div>
          </Section>

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
