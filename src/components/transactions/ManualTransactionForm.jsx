import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button, ButtonGroup } from "../buttons/Button";
import { createManualTransaction, editManualTransaction, fetchAccounts } from "../../api/api-service";
import { CURRENCIES } from "../../consts/formValues";

const isEditMode = (data) => !!data?.transactionId;

const SectionLabel = ({ children }) => (
  <>
    <div className="col-12 mt-3">
      <p className="fw-semibold text-muted small text-uppercase mb-0" style={{ letterSpacing: "0.06em" }}>
        {children}
      </p>
      <hr className="mt-1 mb-0" />
    </div>
  </>
);

export const ManualTransactionForm = ({ data, onClose }) => {
  const editMode = isEditMode(data);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      accountId: data?.accountId || "",
      type: data?.type || "DEBIT",
      amount: data?.amount || "1500.00",
      currency: data?.currency || "USD",
      transactionDate: data?.transactionDate ? data.transactionDate.slice(0, 16) : "2026-04-29T10:30",
      description: data?.description || "Wire transfer to supplier",
      payeeName: data?.payeeName || "John Doe",
      payeeAccountNo: data?.payeeAccountNo || "1234567890",
      payeeBankName: data?.payeeBankName || "Chase Bank",
      payeeBankAddress: data?.payeeBankAddress || "270 Park Ave, New York, NY 10017",
      beneficiaryName: data?.beneficiaryName || "Acme Corp",
      beneficiaryAccountNo: data?.beneficiaryAccountNo || "0987654321",
      beneficiaryBankName: data?.beneficiaryBankName || "Barclays Bank",
      beneficiaryBankAddress: data?.beneficiaryBankAddress || "1 Churchill Place, London E14 5HP",
      beneficiaryCurrency: data?.beneficiaryCurrency || "GBP",
      beneficiaryAmount: data?.beneficiaryAmount || "1180.50",
      transactionFee: data?.transactionFee || "25.00",
    },
  });

  const selectedType = watch("type");
  const watchedAmount = parseFloat(watch("amount")) || 0;
  const watchedFee = parseFloat(watch("transactionFee")) || 0;
  const netAmount = Math.max(0, watchedAmount - watchedFee);

  const accountsQuery = useQuery({
    queryKey: ["accounts/list"],
    queryFn: () => fetchAccounts({ query: {}, populate: "user" }),
  });

  const mutation = useMutation({
    mutationFn: editMode ? editManualTransaction : createManualTransaction,
    onSuccess: (res) => {
      toast(res.message, { type: "success" });
      onClose();
    },
    onError: () => onClose(),
  });

  const handleFormSubmit = (formData) => {
    const amount = parseFloat(formData.amount);
    const fee = formData.transactionFee ? parseFloat(formData.transactionFee) : 0;

    const payload = {
      type: formData.type,
      amount,
      currency: formData.currency,
      transactionDate: new Date(formData.transactionDate).toISOString(),
      description: formData.description,
      transactionFee: fee || undefined,
      netAmount: Math.max(0, amount - fee),
      payeeName: formData.payeeName,
      payeeAccountNo: formData.payeeAccountNo,
      payeeBankName: formData.payeeBankName,
      payeeBankAddress: formData.payeeBankAddress,
      beneficiaryName: formData.beneficiaryName,
      beneficiaryAccountNo: formData.beneficiaryAccountNo,
      beneficiaryBankName: formData.beneficiaryBankName,
      beneficiaryBankAddress: formData.beneficiaryBankAddress,
      beneficiaryCurrency: formData.beneficiaryCurrency,
      beneficiaryAmount: formData.beneficiaryAmount ? parseFloat(formData.beneficiaryAmount) : undefined,
    };

    if (editMode) {
      payload.transactionId = data._id;
    } else {
      payload.accountId = formData.accountId;
    }

    mutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <fieldset disabled={mutation.isPending}>
        <div className="row g-3">

          {/* ── Transaction Details ── */}
          <SectionLabel>Transaction Details</SectionLabel>

          {/* Account — create only */}
          {!editMode && (
            <div className="col-12">
              <label htmlFor="accountId" className="form-label required">Account</label>
              <select
                id="accountId"
                className={`form-select ${errors?.accountId && "is-invalid"}`}
                {...register("accountId", { required: { value: true, message: "Required Field" } })}
              >
                <option value="">Select Account</option>
                {accountsQuery.data?.content?.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.accountNo} — {acc.accountName} ({acc.currency})
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">{errors?.accountId?.message}</div>
            </div>
          )}

          {/* Type */}
          <div className="col-12">
            <label className="form-label required">Type</label>
            <div className="d-flex gap-2">
              {["CREDIT", "DEBIT"].map((t) => (
                <label
                  key={t}
                  className={`badge fs-6 px-4 py-2 border ${
                    selectedType === t
                      ? t === "CREDIT"
                        ? "bg-success text-white border-success"
                        : "bg-danger text-white border-danger"
                      : "bg-light text-dark border-secondary"
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <input type="radio" value={t} className="d-none"
                    {...register("type", { required: { value: true, message: "Required Field" } })}
                  />
                  {t}
                </label>
              ))}
            </div>
            {errors?.type && <div className="text-danger small mt-1">{errors.type.message}</div>}
          </div>

          {/* Transaction Date */}
          <div className="col-12">
            <label htmlFor="transactionDate" className="form-label required">Transaction Date</label>
            <input
              type="datetime-local"
              id="transactionDate"
              className={`form-control ${errors?.transactionDate && "is-invalid"}`}
              {...register("transactionDate", { required: { value: true, message: "Required Field" } })}
            />
            <div className="invalid-feedback">{errors?.transactionDate?.message}</div>
          </div>

          {/* Description */}
          <div className="col-12">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              rows={2}
              maxLength={255}
              className="form-control"
              {...register("description")}
            />
          </div>

          {/* ── Amount & Fees ── */}
          <SectionLabel>Amount & Fees</SectionLabel>

          {/* Amount */}
          <div className="col-6">
            <label htmlFor="amount" className="form-label required">Amount</label>
            <input
              type="number"
              step="0.01"
              id="amount"
              className={`form-control ${errors?.amount && "is-invalid"}`}
              {...register("amount", {
                required: { value: true, message: "Required Field" },
                min: { value: 0.01, message: "Must be greater than 0" },
              })}
            />
            <div className="invalid-feedback">{errors?.amount?.message}</div>
          </div>

          {/* Currency */}
          <div className="col-6">
            <label htmlFor="currency" className="form-label required">Currency</label>
            <select
              id="currency"
              className={`form-select ${errors?.currency && "is-invalid"}`}
              {...register("currency", { required: { value: true, message: "Required Field" } })}
            >
              <option value="">Select Currency</option>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code} – {c.name}</option>
              ))}
            </select>
            <div className="invalid-feedback">{errors?.currency?.message}</div>
          </div>

          {/* Transaction Fee */}
          <div className="col-6">
            <label htmlFor="transactionFee" className="form-label">Transaction Fee</label>
            <input
              type="number"
              step="0.01"
              id="transactionFee"
              className="form-control"
              {...register("transactionFee")}
            />
          </div>

          {/* Net Amount — read only */}
          <div className="col-6">
            <label className="form-label">Net Amount</label>
            <div
              className={`form-control fw-bold ${
                selectedType === "CREDIT" ? "text-success" : "text-danger"
              }`}
              style={{ background: "#f8f9fa", cursor: "default" }}
            >
              {netAmount.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="form-text">Amount − Fee (auto-calculated)</div>
          </div>

          {/* ── Payee Details ── */}
          <SectionLabel>Payee Details</SectionLabel>

          <div className="col-6">
            <label className="form-label">Payee Name</label>
            <input type="text" className="form-control" {...register("payeeName")} />
          </div>
          <div className="col-6">
            <label className="form-label">Payee Account No.</label>
            <input type="text" className="form-control" {...register("payeeAccountNo")} />
          </div>
          <div className="col-6">
            <label className="form-label">Payee Bank Name</label>
            <input type="text" className="form-control" {...register("payeeBankName")} />
          </div>
          <div className="col-6">
            <label className="form-label">Payee Bank Address</label>
            <input type="text" className="form-control" {...register("payeeBankAddress")} />
          </div>

          {/* ── Beneficiary Details ── */}
          <SectionLabel>Beneficiary Details</SectionLabel>

          <div className="col-6">
            <label className="form-label">Beneficiary Name</label>
            <input type="text" className="form-control" {...register("beneficiaryName")} />
          </div>
          <div className="col-6">
            <label className="form-label">Beneficiary Account No.</label>
            <input type="text" className="form-control" {...register("beneficiaryAccountNo")} />
          </div>
          <div className="col-6">
            <label className="form-label">Beneficiary Bank Name</label>
            <input type="text" className="form-control" {...register("beneficiaryBankName")} />
          </div>
          <div className="col-6">
            <label className="form-label">Beneficiary Bank Address</label>
            <input type="text" className="form-control" {...register("beneficiaryBankAddress")} />
          </div>
          <div className="col-6">
            <label className="form-label">Beneficiary Currency</label>
            <select className="form-select" {...register("beneficiaryCurrency")}>
              <option value="">Select Currency</option>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code} – {c.name}</option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label className="form-label">Beneficiary Amount</label>
            <input type="number" step="0.01" className="form-control" {...register("beneficiaryAmount")} />
          </div>

          {/* ── Actions ── */}
          <div className="col-12 mt-3">
            <ButtonGroup>
              <Button
                loading={mutation.isPending}
                className="btn btn-primary"
                text={editMode ? "Save Changes" : "Confirm & Create"}
                type="submit"
              />
              <Button className="btn btn-light" text="Cancel" onClick={onClose} />
            </ButtonGroup>
          </div>

        </div>
      </fieldset>
    </form>
  );
};
