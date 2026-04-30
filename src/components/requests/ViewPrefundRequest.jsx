import { SectionHeader } from "../SectionHeader";
import { DisplayDataColumn } from "../DisplayData";
import { Section } from "../Section";
import { Button, ButtonGroup } from "../buttons/Button";
import { format } from "date-fns";
import { DATE_FORMAT } from "../../consts/AppContants";
import { formatAmount, getAmountWithCurrency } from "../../utils/utils";
import { STATUS_ENUMS_ICONS } from "../../consts/formValues";

export const ViewPrefundRequest = ({ data = {}, onClose }) => {
  return (
    <>
      <div className="row g-3">
        <div className="col-sm-12 -col-md-12 col-lg-12">
          <SectionHeader title={"Request Details"} />
          <DisplayDataColumn
            data={[
              {
                text: "status",
                value: (
                  <span className="text-capitalize">
                    {STATUS_ENUMS_ICONS[data?.status]}
                  </span>
                ),
              },
              {
                text: "request ID",
                value: data?.requestId,
              },
              {
                text: "request date",
                value: format(data?.createdAt, DATE_FORMAT),
              },
              {
                text: "requester name",
                value: `${data?.requestedBy?.firstName} ${data?.requestedBy?.lastName}`,
              },
              {
                text: "request description",
                value: data?.description,
              },
            ]}
          />
        </div>
        <div className="col-sm-12 -col-md-12 col-lg-12">
          <SectionHeader title={"Requester Account Details"} />
          <DisplayDataColumn
            data={[
              {
                text: "account active",
                value: data?.account?.active ? "✅" : "❌",
              },
              {
                text: "requester account No.",
                value: data?.account?.accountNo,
              },
              {
                text: "currency",
                value: data?.account?.currency,
              },
            ]}
          />
        </div>
        <div className="col-sm-12 -col-md-12 col-lg-12">
          <SectionHeader title={"Amount Details"} />
          <DisplayDataColumn
            data={[
              {
                text: "requested Amount",
                value: getAmountWithCurrency(
                  formatAmount(data?.amount),
                  data?.account?.currency
                ),
              },
              {
                text: "Approved Amount",
                value: getAmountWithCurrency(
                  formatAmount(data?.approvedAmount),
                  data?.account?.currency
                ),
              },
            ]}
          />
        </div>
      </div>

      <Section className={"mt-5"}>
        <ButtonGroup>
          <Button
            className="btn btn-primary"
            text={"Close"}
            type="button"
            onClick={() => onClose()}
          />
        </ButtonGroup>
      </Section>
    </>
  );
};
