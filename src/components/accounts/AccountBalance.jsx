import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button, ButtonGroup } from "../buttons/Button";
import {
  UpdateAccBalance,
  createAccount,
  fetchUsers,
} from "../../api/api-service";
import { CURRENCIES } from "../../consts/formValues";
import { Spinner } from "../spinner";
import { DisplayData, DisplayContent, DisplayDataColumn } from "../DisplayData";
import { formatAmount, getAmountWithCurrency } from "../../utils/utils";

export const AccountBalanceEditForm = ({ data, onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const selectedCurrency = watch("currency");

  const query = useQuery({
    queryKey: ["users/list"],
    queryFn: () =>
      fetchUsers({
        role: "USER",
        status: "approved",
      }),
  });

  const Mutation = useMutation({
    mutationFn: UpdateAccBalance,
    onSuccess: (res) => {
      toast(res.message, {
        type: "success",
      });
      onClose();
    },
    onError: () => onClose(),
  });

  const handleFormSubmit = (formData) => {
    console.log(formData);

    const isConfirm = window.confirm("Please Confirm to Continue");
    if (!isConfirm) return;

    const payload = {};
    payload.accountId = data._id;
    payload.balance = formData.balance;

    Mutation.mutate(payload);
  };

  if (query.isLoading) return <Spinner />;

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <fieldset disabled={Mutation.isPending}>
          <div className="row mb-4 g-3">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <DisplayDataColumn
                data={[
                  {
                    text: "Account Number",
                    value: data?.accountNo ? data.accountNo : "-",
                  },
                  {
                    text: "Account Holder",
                    value: `${data?.user.firstName} ${data?.user.lastName}`,
                  },
                  {
                    text: "Account Name",
                    value: data?.accountName ? data.accountName : "-",
                  },
                  {
                    text: "current balance",
                    value: getAmountWithCurrency(
                      formatAmount(data?.balance),
                      data?.currency
                    ),
                  },
                ]}
              />
            </div>

            <div className="col-sm-12 col-md-12 col-lg-12">
              <label
                htmlFor="balance"
                className="form-label text-capitalize required"
              >
                Enter Balance
              </label>
              <div class="input-group ">
                <span class="input-group-text">{data.currency}</span>
                <input
                  type="text"
                  id="balance"
                  className={`form-control ${errors?.balance && "is-invalid"}`}
                  {...register("balance", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Only numeric values are allowed",
                    },
                  })}
                />
                <div className="invalid-feedback">
                  {errors.balance && errors.balance.message}
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
