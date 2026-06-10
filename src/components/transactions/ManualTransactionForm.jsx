import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, ButtonGroup } from "../buttons/Button";
import {
  createManualTransaction,
  editManualTransaction,
  fetchAccounts,
  sendManualTransactionOtp,
} from "../../api/api-service";
import { CURRENCIES } from "../../consts/formValues";
import { ROLES } from "../../consts/AppRoles";
import { OTP_REQUIRE_PERMISSION } from "../../consts/Permissions";

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
  const currentUser = useSelector((s) => s.auth.currentUser);
  const permissions = useSelector((s) => s.auth.permissions);

  // OTP is required only when the role has the "Require OTP" permission checked.
  // SUPER never needs OTP. Unchecked/absent => OTP bypassed.
  const requiresOtp =
    !editMode &&
    currentUser?.role !== ROLES.SUPER &&
    Array.isArray(permissions) &&
    permissions.includes(OTP_REQUIRE_PERMISSION);

  // "form" → fill details, "verify" → enter emailed OTP (create flow only)
  const [step, setStep] = useState("form");
  const [pendingPayload, setPendingPayload] = useState(null);
  const [otp, setOtp] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      accountId: data?.accountId || "",
      type: data?.type || "",
      amount: data?.amount || "",
      currency: data?.currency || "",
      transactionDate: data?.transactionDate ? data.transactionDate.slice(0, 16) : "",
      description: data?.description || "",
      payeeName: data?.payeeName || "",
      payeeAccountNo: data?.payeeAccountNo || "",
      payeeBankName: data?.payeeBankName || "",
      payeeBankAddress: data?.payeeBankAddress || "",
      beneficiaryName: data?.beneficiaryName || "",
      beneficiaryAccountNo: data?.beneficiaryAccountNo || "",
      beneficiaryBankName: data?.beneficiaryBankName || "",
      beneficiaryBankAddress: data?.beneficiaryBankAddress || "",
      beneficiaryCurrency: data?.beneficiaryCurrency || "",
      beneficiaryAmount: data?.beneficiaryAmount || "",
      transactionFee: data?.transactionFee || "",
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

  // Final submit (edit = direct save, create = verified submit with OTP)
  const submitMutation = useMutation({
    mutationFn: editMode ? editManualTransaction : createManualTransaction,
    onSuccess: (res) => {
      toast(res.msg || res.message || "Saved", { type: "success" });
      onClose();
    },
    onError: () => {
      // keep the drawer open on the verify step so the user can retry the code
      if (!editMode && step === "verify") return;
      onClose();
    },
  });

  // Step 1 (create only): email an OTP to the logged-in user
  const otpMutation = useMutation({
    mutationFn: sendManualTransactionOtp,
    onSuccess: () => {
      setStep("verify");
      setOtp("");
    },
  });

  const buildPayload = (formData) => {
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

    return payload;
  };

  const handleFormSubmit = (formData) => {
    const payload = buildPayload(formData);

    // edit, or SUPER create → submit directly (no OTP)
    if (!requiresOtp) {
      submitMutation.mutate(payload);
      return;
    }

    // create flow → request an OTP before submitting
    setPendingPayload(payload);
    otpMutation.mutate({ amount: payload.amount, currency: payload.currency });
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 4) {
      toast("Enter the verification code", { type: "error" });
      return;
    }
    submitMutation.mutate({ ...pendingPayload, otp: otp.trim() });
  };

  const handleResend = () => {
    if (!pendingPayload) return;
    otpMutation.mutate({ amount: pendingPayload.amount, currency: pendingPayload.currency });
  };

  // ── Verification step (non-super create flow) ──
  if (requiresOtp && step === "verify") {
    return (
      <form onSubmit={handleVerifySubmit}>
        <fieldset disabled={submitMutation.isPending}>
          <div className="text-center py-2">
            <div
              className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: 64, height: 64 }}
            >
              <span style={{ fontSize: 28 }}>🔒</span>
            </div>
            <h5 className="fw-light mb-1">Payment Verification</h5>
            <p className="text-muted small mb-0">
              We sent a 6-digit code to
              <span className="fw-semibold"> {currentUser?.email || "your email"}</span>.
              Enter it below to confirm and submit this payment.
            </p>
          </div>

          {/* Summary */}
          <div className="card border-0 bg-light my-3">
            <div className="card-body py-2 d-flex justify-content-between align-items-center">
              <span className="text-muted small">Amount</span>
              <span className={`fw-bold ${pendingPayload?.type === "CREDIT" ? "text-success" : "text-danger"}`}>
                {pendingPayload?.currency}{" "}
                {Number(pendingPayload?.amount || 0).toLocaleString("en", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="otp" className="form-label required">
              Verification Code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className="form-control form-control-lg text-center"
              style={{ letterSpacing: "0.5em" }}
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <ButtonGroup>
            <Button
              loading={submitMutation.isPending}
              className="btn btn-primary"
              text="Verify & Submit"
              type="submit"
            />
            <Button
              className="btn btn-light"
              text="Back"
              type="button"
              disabled={submitMutation.isPending}
              onClick={() => setStep("form")}
            />
          </ButtonGroup>

          <div className="mt-3 text-center">
            <Button
              className="btn btn-link btn-sm text-decoration-none"
              text={otpMutation.isPending ? "Sending..." : "Didn't get it? Resend code"}
              type="button"
              disabled={otpMutation.isPending || submitMutation.isPending}
              onClick={handleResend}
            />
          </div>
        </fieldset>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <fieldset disabled={otpMutation.isPending || submitMutation.isPending}>
        <div className="row g-3">
          {/* ── Transaction Details ── */}
          <SectionLabel>Transaction Details</SectionLabel>

          {/* Account — create only */}
          {!editMode && (
            <div className="col-12">
              <label htmlFor="accountId" className="form-label required">
                Account
              </label>
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
                  <input
                    type="radio"
                    value={t}
                    className="d-none"
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
            <label htmlFor="transactionDate" className="form-label required">
              Transaction Date
            </label>
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
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea id="description" rows={2} maxLength={255} className="form-control" {...register("description")} />
          </div>

          {/* ── Amount & Fees ── */}
          <SectionLabel>Amount & Fees</SectionLabel>

          {/* Amount */}
          <div className="col-6">
            <label htmlFor="amount" className="form-label required">
              Amount
            </label>
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
            <label htmlFor="currency" className="form-label required">
              Currency
            </label>
            <select
              id="currency"
              className={`form-select ${errors?.currency && "is-invalid"}`}
              {...register("currency", { required: { value: true, message: "Required Field" } })}
            >
              <option value="">Select Currency</option>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} – {c.name}
                </option>
              ))}
            </select>
            <div className="invalid-feedback">{errors?.currency?.message}</div>
          </div>

          {/* Transaction Fee */}
          <div className="col-6">
            <label htmlFor="transactionFee" className="form-label">
              Transaction Fee
            </label>
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
              className={`form-control fw-bold ${selectedType === "CREDIT" ? "text-success" : "text-danger"}`}
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
                <option key={c.code} value={c.code}>
                  {c.code} – {c.name}
                </option>
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
                loading={requiresOtp ? otpMutation.isPending : submitMutation.isPending}
                className="btn btn-primary"
                text={editMode ? "Save Changes" : requiresOtp ? "Continue to Verify" : "Confirm & Create"}
                type="submit"
              />
              <Button className="btn btn-light" text="Cancel" type="button" onClick={onClose} />
            </ButtonGroup>
            {requiresOtp && (
              <p className="text-muted small mt-2 mb-0">
                A verification code will be emailed to you before the payment is submitted.
              </p>
            )}
          </div>
        </div>
      </fieldset>
    </form>
  );
};
