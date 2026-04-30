import { Section } from "../../components/Section";
import { DisplayDataColumn } from "../DisplayData";
import { SectionHeader } from "../../components/SectionHeader";

export const ViewTransaction = ({ data }) => {
  return (
    <>
      {/* bussiness detiails */}
      <Section>
        <SectionHeader title="Transaction" />
        <DisplayDataColumn
          data={[
            {
              text: "Transaction Id",
              value: "asddad",
            },
            {
              text: "Date / Time",
              value: "",
            },
            {
              text: "Status",
              value: "",
            },
            {
              text: "Debit/Credit",
              value: "",
            },
            {
              text: "Amount",
              value: "",
            },
            {
              text: "Description",
              value: "",
            },
          ]}
        />
      </Section>
      <Section>
        <SectionHeader title="Account" />
        <DisplayDataColumn
          data={[
            {
              text: "Account No.",
              value: "",
            },
            {
              text: "Account Type",
              value: "",
            },
            {
              text: "Currency",
              value: "",
            },
          ]}
        />
      </Section>
      <Section>
        <SectionHeader title="Profile" />
        <DisplayDataColumn
          data={[
            {
              text: "company name",
              value: "",
            },
            {
              text: "first name",
              value: "",
            },
            {
              text: "last name",
              value: "",
            },
          ]}
        />
      </Section>
    </>
  );
};
