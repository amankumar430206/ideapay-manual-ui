import { format } from "date-fns";
import { Section } from "../../components/Section";
import { DisplayDataColumn } from "../DisplayData";
import { SectionHeader } from "../../components/SectionHeader";
import { formatAmount } from "../../utils/utils";

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return format(new Date(d), "dd MMM yyyy, hh:mm a");
  } catch {
    return "—";
  }
};

export const ViewTransaction = ({ data = {} }) => {
  const account = data?.senderAccountId || data?.receiverAccountId || {};

  return (
    <>
      <Section>
        <SectionHeader title="Transaction" />
        <DisplayDataColumn
          data={[
            { text: "Transaction Id", value: data?.transactionId || data?._id || "—" },
            { text: "Date / Time", value: fmtDate(data?.transactionDate || data?.createdAt) },
            {
              text: "Status",
              value: (
                <span className="text-uppercase fw-semibold">{data?.status || "—"}</span>
              ),
            },
            {
              text: "Verification",
              value: data?.verified ? (
                <span className="badge bg-success-subtle text-success border border-success-subtle">
                  ✓ Verified{data?.verifiedAt ? ` · ${fmtDate(data.verifiedAt)}` : ""}
                </span>
              ) : (
                <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
                  Not verified
                </span>
              ),
            },
            { text: "Debit/Credit", value: data?.type || "—" },
            {
              text: "Amount",
              value: `${data?.currency || ""} ${data?.amount != null ? formatAmount(data.amount) : "—"}`,
            },
            { text: "Description", value: data?.description || "—" },
          ]}
        />
      </Section>

      <Section>
        <SectionHeader title="Account" />
        <DisplayDataColumn
          data={[
            { text: "Account No.", value: account?.accountNo || "—" },
            { text: "Account Name", value: account?.accountName || "—" },
            { text: "Currency", value: account?.currency || data?.currency || "—" },
          ]}
        />
      </Section>

      <Section>
        <SectionHeader title="Payee" />
        <DisplayDataColumn
          data={[
            { text: "Payee Name", value: data?.payeeName || "—" },
            { text: "Payee Account No.", value: data?.payeeAccountNo || "—" },
            { text: "Payee Bank", value: data?.payeeBankName || "—" },
          ]}
        />
      </Section>
    </>
  );
};
