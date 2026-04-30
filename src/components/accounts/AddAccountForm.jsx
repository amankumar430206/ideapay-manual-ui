import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button, ButtonGroup } from "../buttons/Button";
import { createAccount, fetchUsers } from "../../api/api-service";
import { CURRENCIES } from "../../consts/formValues";
import { COUNTRIES } from "../../consts/countries";
import { Spinner } from "../spinner";
import { useSelector } from "react-redux";
import { ROLES } from "../../consts/AppRoles";

export const AddAccountForm = ({ data, onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user: data?._id || "",
    },
  });

  const selectedCurrency = watch("currency");
  const currentUser = useSelector((s) => s.auth.currentUser);

  const query = useQuery({
    queryKey: ["users/list"],
    queryFn: () =>
      fetchUsers({
        role: "USER",
        status: "approved",
        user: currentUser?.role === ROLES.ADMIN ? null : currentUser?._id,
      }),
  });

  const Mutation = useMutation({
    mutationFn: createAccount,
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
    if (currentUser?.role === ROLES.ADMIN) {
      payload.active = true;
      payload.status = "active";
      payload.openingBalance = formData.balance;
    }

    payload.user = formData.user;
    payload.currency = formData.currency;
    payload.description = formData.description;
    payload.accountName = formData.accountName;
    payload.accountNo = formData.accountNo;
    payload.accountType = formData.accountType;
    payload.routingCode = formData.routingCode;
    payload.bankName = formData.bankName;
    payload.bankAddress = formData.bankAddress;
    payload.country = formData.country;

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
                <label htmlFor="user" className="form-label text-capitalize required">
                  Account Holder
                </label>
                <select
                  disabled={currentUser?.role == ROLES.USER}
                  id="user"
                  className={`form-select ${errors?.user && "is-invalid"}`}
                  {...register("user", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                >
                  <option value="">Select User</option>
                  {query.data?.content.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.firstName} {item.lastName} ({item.userId})
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">{errors?.user && errors?.user.message}</div>
              </div>
            </div>

            <div className="col-sm-12 col-md-6">
              <div className="">
                <label htmlFor="currency" className="form-label text-capitalize required">
                  Currency
                </label>
                <select
                  id="currency"
                  className={`form-select ${errors?.currency && "is-invalid"}`}
                  {...register("currency", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                    disabled: query.isLoading,
                  })}
                >
                  <option value="">Select Currency</option>
                  {CURRENCIES?.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code} ({item.name}) - {item.country}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">{errors?.currency && errors?.currency.message}</div>
              </div>
            </div>

            <div className="col-sm-12 col-md-6">
              <label htmlFor="country" className="form-label text-capitalize">
                Country
              </label>
              <select id="country" className="form-select" {...register("country")}>
                <option value="">Select Country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.iso2} value={c.iso2}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-12 col-md-6">
              <label htmlFor="accountName" className="form-label text-capitalize">
                Account Name
              </label>
              <div class="input-group ">
                <input
                  type="text"
                  id="accountName"
                  className={`form-control ${errors?.accountName && "is-invalid"}`}
                  {...register("accountName", {})}
                />
                <div className="invalid-feedback">{errors.accountName && errors.accountName.message}</div>
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6">
              <label htmlFor="accountNo" className="form-label text-capitalize required">
                Account No
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="accountNo"
                  className={`form-control ${errors?.accountNo && "is-invalid"}`}
                  {...register("accountNo", {
                    required: {
                      value: true,
                      message: "Required Field",
                    },
                  })}
                />
                <div className="invalid-feedback">{errors.accountNo && errors.accountNo.message}</div>
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6">
              <label htmlFor="accountType" className="form-label text-capitalize required">
                Account Type
              </label>
              <select
                id="accountType"
                className={`form-select ${errors?.accountType && "is-invalid"}`}
                {...register("accountType", {
                  required: {
                    value: true,
                    message: "Required Field",
                  },
                })}
              >
                <option value="">Select Type</option>
                <option value="local">Local</option>
                <option value="swift">Swift</option>
              </select>
              <div className="invalid-feedback">{errors.accountType && errors.accountType.message}</div>
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6">
              <label htmlFor="routingCode" className="form-label text-capitalize">
                Routing / SWIFT Code
              </label>
              <input
                type="text"
                id="routingCode"
                className={`form-control ${errors?.routingCode && "is-invalid"}`}
                placeholder="e.g. CHASUS33 or 021000021"
                {...register("routingCode")}
              />
              <div className="invalid-feedback">{errors.routingCode && errors.routingCode.message}</div>
            </div>

            {/* ── Bank Details ── */}
            <div className="col-12">
              <p className="fw-semibold text-muted mb-0 mt-2">Bank Details</p>
              <hr className="mt-1" />
            </div>

            <div className="col-sm-12 col-md-12 col-lg-12">
              <label htmlFor="bankName" className="form-label text-capitalize">
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                className={`form-control ${errors?.bankName && "is-invalid"}`}
                {...register("bankName")}
              />
            </div>

            <div className="col-sm-12 col-md-8 col-lg-8">
              <label htmlFor="bankAddress" className="form-label text-capitalize">
                Bank Address
              </label>
              <input type="text" id="bankAddress" className="form-control" {...register("bankAddress")} />
            </div>

            {selectedCurrency && (
              <div className="col-sm-12 col-md-12 col-lg-12">
                <label htmlFor="balance" className="form-label text-capitalize">
                  Opening Balance
                </label>
                <div class="input-group ">
                  <span class="input-group-text">{selectedCurrency || "Select Currency"}</span>
                  <input
                    type="text"
                    id="balance"
                    className={`form-control ${errors?.balance && "is-invalid"}`}
                    defaultValue={0}
                    {...register("balance", {
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Only numeric values are allowed",
                      },
                      disabled: !selectedCurrency,
                    })}
                  />
                  <div className="invalid-feedback">{errors.balance && errors.balance.message}</div>
                </div>
              </div>
            )}

            <div className="col-sm-12 col-md-12 col-lg-12">
              <label for="description" className="form-label text-capitalize">
                description
              </label>
              <textarea
                maxLength={255}
                rows={5}
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                {...register("description", {})}
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
