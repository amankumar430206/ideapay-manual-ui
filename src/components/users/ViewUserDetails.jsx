import React from "react";
import {
  DisplayContent,
  DisplayDataColumn,
} from "../../components/DisplayData";
import { KYC_STATUS } from "../../consts/formValues";
import { useUser } from "../../hooks/useUser";
import { Section } from "../Section";
import { SectionHeader } from "../SectionHeader";
import { Spinner } from "../spinner";

export const ViewUserDetails = ({ id }) => {
  const user = useUser({ id, populate: "businessDetails" });

  if (user.isLoading) return <Spinner />;

  return (
    <>
      {user.data?.content.kycStatus === KYC_STATUS.PENDING && (
        <Section className={"mb-5"}>
          <div className="alert alert-warning">
            <b>Attention</b> Account creation is mandatory for service access.
            Please upload your KYC and wait for 2 hours for KYC verification.
            Take immediate action to proceed, as services cannot be accessed
            without an active account.
          </div>
        </Section>
      )}
      <div className="row g-3 mb-5">
        <div className="col-sm-12 -col-md-12 col-lg-12">
          <SectionHeader title={"General Details"} />
          <DisplayDataColumn
            data={[
              {
                text: "active",
                value: user.data?.content.active ? "✅" : "❌",
              },
              {
                text: "user id",
                value: user.data?.content.userId,
              },
              {
                text: "first name",
                value: user.data?.content.firstName,
              },
              {
                text: "last name",
                value: user.data?.content.lastName,
              },
              {
                text: "email address",
                value: user.data?.content.email,
              },
            ]}
          />
        </div>
        {user?.data?.content.accountType !== "personal" && (
          <div className="col-sm-12 -col-md-12 col-lg-12">
            <SectionHeader title={"Business Details"} />
            <DisplayDataColumn
              data={[
                {
                  text: "business name",
                  value: user.data?.content?.businessDetails?.businessName,
                },
                {
                  text: "business trade name",
                  value: user.data?.content?.businessDetails?.businessTradeName,
                },
                {
                  text: "business type",
                  value: user.data?.content?.businessDetails?.businessType,
                },
                {
                  text: "business number",
                  value: user.data?.content?.businessDetails?.businessNumber,
                },
                {
                  text: "business PAN / GST",
                  value: user.data?.content?.businessDetails?.businessPANGST,
                },
                {
                  text: "business contact",
                  value: user.data?.content?.businessDetails?.businessContact,
                },
                {
                  text: "website",
                  value: (
                    <>
                      <a
                        href={user.data?.content?.businessDetails?.website}
                        target="_blank"
                      >
                        Visit Website
                      </a>
                    </>
                  ),
                },
              ]}
            />
          </div>
        )}
        <div className="col-sm-12 -col-md-12 col-lg-12">
          <Section>
            <SectionHeader title={"Business Address Details"} />
            <DisplayDataColumn
              data={[
                {
                  text: "address line 1",
                  value: user.data?.content?.businessDetails?.address1,
                },
                {
                  text: "address line 2",
                  value: user.data?.content?.businessDetails?.address2,
                },
                {
                  text: "state",
                  value: user.data?.content?.businessDetails?.state,
                },
                {
                  text: "city",
                  value: user.data?.content?.businessDetails?.city,
                },
                {
                  text: "country",
                  value: user.data?.content?.businessDetails?.country,
                },
                {
                  text: "ZIPCODE",
                  value: user.data?.content?.businessDetails?.zipcode,
                },
              ]}
            />
          </Section>

          <DisplayContent
            data={[
              {
                text: "About Business",
                value: user.data?.content?.businessDetails?.about
                  ? user.data?.content?.businessDetails?.about
                  : "-",
              },
            ]}
          />
        </div>
        <div className="col-sm-12 -col-md-12 col-lg-12">
          <SectionHeader title={"Business Documents"} />
          <DisplayDataColumn
            data={[
              {
                text: "KYC document",
                value: (
                  <>
                    {user.data?.content?.businessDetails?.documents
                      ?.kycDocument && (
                      <a
                        href={
                          user.data?.content?.businessDetails?.documents
                            ?.kycDocument
                        }
                        target="_blank"
                      >
                        View Document
                      </a>
                    )}
                  </>
                ),
              },
              {
                text: "Inc. Certificate",
                value: (
                  <>
                    {user.data?.content?.businessDetails?.documents
                      ?.incCertificate && (
                      <a
                        className="disabled"
                        href={
                          user.data?.content?.businessDetails?.documents
                            ?.incCertificate
                        }
                        target="_blank"
                      >
                        View Document
                      </a>
                    )}
                  </>
                ),
              },
            ]}
          />
        </div>

        {!!user.data?.content?.businessDetails?.passport?.client_id && (
          <div className="col-sm-12 -col-md-12 col-lg-12">
            <SectionHeader title={"Passport Details"} />
            <DisplayDataColumn
              data={[
                {
                  text: "passport no.",
                  value:
                    user.data?.content?.businessDetails?.passport
                      ?.passport_number,
                },
                {
                  text: "passport type",
                  value:
                    user.data?.content?.businessDetails?.passport
                      ?.passport_type,
                },
                {
                  text: "given_names",
                  value:
                    user.data?.content?.businessDetails?.passport?.given_names,
                },
                {
                  text: "surname",
                  value: user.data?.content?.businessDetails?.passport?.surname,
                },
                {
                  text: "date of birth",
                  value:
                    user.data?.content?.businessDetails?.passport
                      ?.date_of_birth,
                },
                {
                  text: "nationality",
                  value:
                    user.data?.content?.businessDetails?.passport?.nationality,
                },
                {
                  text: "issue date",
                  value:
                    user.data?.content?.businessDetails?.passport?.issue_date,
                },
                {
                  text: "expiry date",
                  value:
                    user.data?.content?.businessDetails?.passport?.expiry_date,
                },
                {
                  text: "issuing authority",
                  value:
                    user.data?.content?.businessDetails?.passport
                      ?.issuing_authority,
                },
              ]}
            />
          </div>
        )}
      </div>
    </>
  );
};
