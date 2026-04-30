import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  CheckAccountActivateRequest,
  UploadAccActivationReceipt,
} from "../../api/api-service";
import { ROLES } from "../../consts/AppRoles";
import { useAccounts } from "../../hooks/useAccounts";
import { Button, ButtonGroup } from "../buttons/Button";
import { Spinner } from "../spinner";

export const UploadReceiptForm = ({ data, onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      account: data?._id || "",
      referenceNo: data?.accountNo || "CUS-",
    },
  });

  const selectedCountry = watch("country");
  const selectedAccount = watch("account");

  const [pdfFile, setPdfFile] = useState(null);

  const currentUser = useSelector((s) => s.auth.currentUser);

  const query = useAccounts({
    query: {
      user: currentUser?.role === ROLES.USER ? currentUser?._id : "",
    },
    populate: "user",
  });

  const validateAccountRequest = useQuery({
    queryKey: ["request", "account", selectedAccount],
    queryFn: () =>
      CheckAccountActivateRequest({
        account: selectedAccount,
      }),
    enabled: !!selectedAccount,
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

  const handleFormSubmit = (formData) => {
    const payload = new FormData();

    if (validateAccountRequest.data?.requiredReceipt) {
      payload.append("account", formData.account);
      payload.append("receipt", formData.receipt[0]);
      return UploadReceiptMutation.mutate(payload);
    }

    toast("Raise an account activation request for the account.", {
      type: "error",
    });
  };

  if (query.isLoading) return <Spinner />;
  if (validateAccountRequest.isLoading)
    return <Spinner text={"Validating Previous Requests"} />;

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <fieldset disabled={UploadReceiptMutation.isPending}>
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
                  })}
                >
                  <option value="">Select Account</option>
                  {query.data?.content.map((item) => (
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

            {validateAccountRequest.data?.requiredReceipt && (
              <>
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <label
                    htmlFor="receipt"
                    className="form-label text-capitalize required"
                  >
                    Upload Receipt
                  </label>
                  <div class="input-group ">
                    <input
                      type="file"
                      id="receipt"
                      className={`form-control ${
                        errors?.receipt && "is-invalid"
                      }`}
                      {...register("receipt", {
                        required: "Required Field",
                      })}
                    />
                    <div className="invalid-feedback">
                      {errors.receipt && errors.receipt.message}
                    </div>
                  </div>
                </div>

                <ButtonGroup>
                  <Button
                    loading={UploadReceiptMutation.isPending}
                    className="btn btn-primary"
                    text={"Upload & Proceed"}
                    type="submit"
                  />
                  <Button
                    className="btn btn-light"
                    text={"Cancel"}
                    onClick={onClose}
                    type="button"
                  />
                </ButtonGroup>
              </>
            )}
          </div>
        </fieldset>
      </form>
    </>
  );
};
