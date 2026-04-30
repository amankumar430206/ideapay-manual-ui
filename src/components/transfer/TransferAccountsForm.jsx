import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button, ButtonGroup } from "../buttons/Button";
import { TransferBtAccounts, fetchAccounts, fetchUserAccounts } from "../../api/api-service";
import { useSelector } from "react-redux";
import { ROLES } from "../../consts/AppRoles";
import { Spinner } from "../spinner";
import { formatDate } from "date-fns";
import { Repeat } from "react-feather";
import { useState } from "react";

export const TransferAccountsForm = ({ data, onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const currentUser = useSelector((s) => s.auth.currentUser);

  const query = useQuery({
    queryKey: ["accounts/user"],
    queryFn: () =>
      fetchAccounts({
        query: {
          user: currentUser?.role === ROLES.USER ? currentUser?._id : "",
        },
        populate: "",
      }),
  });

  const Mutation = useMutation({
    mutationFn: TransferBtAccounts,
    onSuccess: (res) => {
      toast(res.message, {
        type: "success",
      });
      onClose();
    },
    onError: () => onClose(),
  });

  const isSameAccount = (from, to) => from === to;

  const handleFormSubmit = (formData) => {
    // check for balance and  available funds in the account, before transfer
    if (isSameAccount(formData.account_from, formData.account_to))
      return toast("Same account transfer not available!", { type: "error" });

    const payload = {};
    payload.senderAccountId = formData.account_from;
    payload.receiverAccountId = formData.account_to;
    payload.amount = formData.amount;
    payload.description = formData.description;
    payload.transactionBy = currentUser?._id;

    Mutation.mutate(payload);
  };

  if (query.isLoading) return <Spinner />;

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <fieldset disabled={Mutation.isPending}>
          <div className="row mb-4 g-3">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <div className="">
                <label htmlFor="account_from" className="form-label text-capitalize required">
                  Debit From
                </label>
                <select
                  id="account_from"
                  className={`form-select ${errors?.account_from && "is-invalid"}`}
                  {...register("account_from", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                >
                  <option value="">Select Account</option>
                  {query?.data?.content?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.accountName} ({item.currency}) - {item.accountNo}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">{errors?.account_from && errors?.account_from.message}</div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-12">
              <div className="">
                <label htmlFor="account_to" className="form-label text-capitalize required">
                  Credit To
                </label>
                <select
                  id="account_to"
                  className={`form-select ${errors?.account_to && "is-invalid"}`}
                  {...register("account_to", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                >
                  <option value="">Select Account</option>
                  {query?.data?.content?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.accountName} ({item.currency}) - {item.accountNo}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">{errors?.account_to && errors?.account_to.message}</div>
              </div>
            </div>

            <div className="col-sm-12 col-md-12 col-lg-12">
              <label htmlFor="amount" className="form-label text-capitalize required">
                Amount to transfer
              </label>
              <div class="input-group ">
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
                <div className="invalid-feedback">{errors.amount && errors.amount.message}</div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-12">
              <label htmlFor="description" className="form-label text-capitalize required">
                description
              </label>
              <textarea
                maxLength={255}
                rows={5}
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                {...register("description", {
                  required: {
                    value: true,
                    message: "Required Field",
                  },
                })}
              ></textarea>
              <div class="invalid-feedback text-start">{errors.description && errors.description.message}</div>
            </div>
          </div>

          <ButtonGroup>
            <Button loading={Mutation.isPending} className="btn btn-primary" text={"Confirm & Proceed"} type="submit" />
            <Button className="btn btn-light" text={"Cancel"} onClick={onClose} />
          </ButtonGroup>
        </fieldset>
      </form>
    </>
  );
};
