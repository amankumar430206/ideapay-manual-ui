import { SectionHeader } from "../SectionHeader";
import { DisplayDataColumn } from "../DisplayData";
import { Section } from "../Section";
import { Button, ButtonGroup } from "../buttons/Button";
import { format } from "date-fns";
import { DATE_FORMAT } from "../../consts/AppContants";
import { formatAmount, getAmountWithCurrency } from "../../utils/utils";
import { STATUS_ENUMS_ICONS } from "../../consts/formValues";

export const ViewCardRequest = ({ data = {}, onClose }) => {
  return (
    <>
      <div className="row g-3">
        <div className="col-sm-12 -col-md-12 col-lg-12">
          <SectionHeader title={"Requester Details"} />
          <DisplayDataColumn
            data={[
              {
                text: "requester id",
                value: data?.requestedBy?.userId,
              },
              {
                text: "requester name",
                value: `${data?.requestedBy?.firstName} ${data?.requestedBy?.lastName}`,
              },
            ]}
          />
        </div>
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
                text: "Desired Go-Live Date",
                value: data?.details?.liveDate,
              },
              {
                text: "Are You A Licensed Financial Institution?",
                value: data?.details?.isLicensed ? "Yes" : "No",
              },
              {
                text: "Do You Plan To Offer Our Products To Your Direct Employees, Contractors Or Clients (Individuals), Or Do You Plan To Offer Them To Other Businesses?",
                value: data?.details?.offerPlanning,
              },
              {
                text: "Please Explain How You Plan To Offer Our Products To Other Businesses.",
                value: data?.details?.offerPlanningReason,
              },
              {
                text: "Do You (Or Your Client) Handle Digital Currencies?",
                value: data?.details?.isDigitailCurrency ? "Yes" : "No",
              },
              {
                text: "Please Select The Range Of Cards And/​Or Wallets You Anticipate Issuing In The First Year.",
                value: data?.details?.cardRange,
              },
              {
                text: "What Need You Are Trying To Solve?",
                value: data?.details?.areasImprovement,
              },
              {
                text: "Areas of Interest",
                value: data?.details?.interestAreas?.map((i) => (
                  <span className="badge bg-primary">{i}</span>
                )),
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
