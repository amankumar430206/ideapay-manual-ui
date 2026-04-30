import { SectionHeader } from "../SectionHeader";
import { DisplayDataColumn } from "../DisplayData";
import { Section } from "../Section";
import { Button, ButtonGroup } from "../buttons/Button";
import { format } from "date-fns";
import { DATE_FORMAT } from "../../consts/AppContants";
import { formatAmount, getAmountWithCurrency } from "../../utils/utils";
import { STATUS_ENUMS_ICONS } from "../../consts/formValues";
import { useMutation } from "@tanstack/react-query";
import { ApprovePrefunRequest } from "../../api/api-service";
import { useForm } from "react-hook-form";

export const ApprovePrefundRequest = ({ data = {}, onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const ApproveMutation = useMutation({
    mutationFn: ApprovePrefunRequest,
    onSuccess: (res) => {
      onClose();
    },
  });

  const handleFormSubmit = (formData) => {
    const confirm = window.confirm("Please Confirm!");
    if (confirm)
      ApproveMutation.mutate({
        requestId: data?._id,
        approvedAmount: formData?.approvedAmount,
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <fieldset disabled={ApproveMutation.isPending}>
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
                ]}
              />
            </div>

            <div className="col-sm-12 col-md-12 col-lg-12">
              <div className="alert alert-warning">
                Default approval amount is same as Requested Amount. It can also
                be modified by the approver, Approval amount cannot be greater
                than requested amount.
              </div>
              <label
                htmlFor="approvedAmount"
                className="form-label text-capitalize required"
              >
                Approval Amount
              </label>
              <div class="input-group ">
                <span class="input-group-text">{data?.account?.currency}</span>
                <input
                  defaultValue={data?.amount}
                  type="text"
                  inputMode="numeric"
                  id="approvedAmount"
                  className={`form-control form-control-lg ${
                    errors?.approvedAmount && "is-invalid"
                  }`}
                  {...register("approvedAmount", {
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
                  {errors.approvedAmount && errors.approvedAmount.message}
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        <Section className={"mt-5"}>
          <ButtonGroup>
            <Button
              className="btn btn-primary"
              text={"Approve Request"}
              type="submit"
            />
            <Button
              className="btn btn-light"
              text={"Close"}
              type="button"
              onClick={() => onClose()}
            />
          </ButtonGroup>
        </Section>
      </form>
    </>
  );
};
