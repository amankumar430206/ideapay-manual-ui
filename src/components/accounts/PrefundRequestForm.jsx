import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button, ButtonGroup } from "../buttons/Button";
import {
  AccountRequestPrefund,
  TransferBtAccounts,
  fetchAccounts,
} from "../../api/api-service";
import { useSelector } from "react-redux";
import { ROLES } from "../../consts/AppRoles";
import { Spinner } from "../spinner";
import { useState } from "react";

export const PrefundRequestForm = ({ data, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const currentUser = useSelector((s) => s.auth.currentUser);
  const [selectedAccount, setSelectedAccount] = useState(null);

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
    mutationFn: AccountRequestPrefund,
    onSuccess: (res) => {
      toast(res.message, {
        type: "success",
      });
      onClose();
    },
    onError: () => onClose(),
  });

  const handleFormSubmit = (formData) => {
    const payload = {};
    payload.account = formData.account_to;
    payload.amount = formData.amount;
    payload.description = formData.description;
    payload.requestedBy = currentUser?._id;

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
                <label
                  htmlFor="account_to"
                  className="form-label text-capitalize required"
                >
                  Account
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
                    onChange: (e) => {
                      const account = query?.data?.content.find(
                        (item) => item._id === e.target.value
                      );
                      setSelectedAccount(account);
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
                <div className="invalid-feedback">
                  {errors?.account_to && errors?.account_to.message}
                </div>
              </div>
            </div>

            {selectedAccount && (
              <>
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <label
                    htmlFor="amount"
                    className="form-label text-capitalize required"
                  >
                    Amount
                  </label>
                  <div class="input-group ">
                    <span className="input-group-text">
                      {selectedAccount?.currency || "Select Account"}
                    </span>
                    <input
                      type="text"
                      id="amount"
                      className={`form-control ${
                        errors?.amount && "is-invalid"
                      }`}
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
                    htmlFor="description"
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
              </>
            )}
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
