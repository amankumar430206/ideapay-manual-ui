import { format } from "date-fns";
import { DisplayDataColumn } from "../DisplayData";
import { SectionHeader } from "../SectionHeader";
import { StatusBadge } from "../utils/StatusBadge";
import { formatAmount } from "../../utils/utils";
import { DATE_FORMAT } from "../../consts/AppContants";

export const ViewAccountDetail = ({ data }) => {
  return (
    <>
      <SectionHeader title="Account Information" />
      <DisplayDataColumn
        data={[
          { text: "Account No.", value: data?.accountNo || "—" },
          { text: "Account Name", value: data?.accountName || "—" },
          { text: "Account Type", value: data?.accountType || "—" },
          { text: "Currency", value: data?.currency || "—" },
          {
            text: "Current Balance",
            value: data?.balance != null ? `${data.currency} ${formatAmount(data.balance)}` : "—",
          },
        ]}
      />

      <SectionHeader title="Account Holder" />
      <DisplayDataColumn
        data={[
          {
            text: "Name",
            value: data?.user ? `${data.user.firstName} ${data.user.lastName}` : "—",
          },
          { text: "User ID", value: data?.user?.userId || "—" },
          { text: "Email", value: data?.user?.email || "—" },
        ]}
      />

      <SectionHeader title="Bank Details" />
      <DisplayDataColumn
        data={[
          { text: "Routing / SWIFT Code", value: data?.routingCode || "—" },
          { text: "Bank Name", value: data?.bankName || "—" },
          { text: "Bank Address", value: data?.bankAddress || "—" },
          { text: "Country", value: data?.country || "—" },
        ]}
      />

      {data?.description && (
        <>
          <SectionHeader title="Description" />
          <p className="text-muted small px-1">{data.description}</p>
        </>
      )}

      <SectionHeader title="Timestamps" />
      <DisplayDataColumn
        data={[
          {
            text: "Created At",
            value: data?.createdAt ? format(new Date(data.createdAt), DATE_FORMAT) : "—",
          },
          {
            text: "Updated At",
            value: data?.updatedAt ? format(new Date(data.updatedAt), DATE_FORMAT) : "—",
          },
        ]}
      />
    </>
  );
};
