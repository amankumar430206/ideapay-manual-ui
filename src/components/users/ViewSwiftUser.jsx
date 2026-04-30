import React, { lazy } from "react";
import { useUser } from "../../hooks/useUser";
import { Spinner } from "../spinner";
import { SectionHeader } from "../SectionHeader";
import { DisplayDataColumn, DisplayData, DisplayContent } from "../DisplayData";
import { Section } from "../Section";
import { Button, ButtonGroup } from "../buttons/Button";

import ImgPlaceholder from "../../static/placeholder.png";

const ViewSwiftUser = ({ id, onClose }) => {
  const user = useUser({ id, populate: "businessDetails" });

  if (user.isLoading) return <Spinner />;

  return (
    <>
      <div className="row g-3 mb-5">
        <div className="col-sm-12 -col-md-12 col-lg-12">
          <div class="text-center">
            <a
              href={
                user.data?.content?.businessDetails?.documents?.businessLogo ||
                ImgPlaceholder
              }
              target="_blank"
            >
              <img
                style={{
                  height: "14rem",
                  width: "14rem",
                }}
                src={
                  user.data?.content?.businessDetails?.documents
                    ?.businessLogo || ImgPlaceholder
                }
                className="img-fluid rounded-circle img-thumbnail"
              />
            </a>
          </div>
        </div>
        <div className="col-sm-12 -col-md-12 col-lg-12">
          <SectionHeader title={"General Details"} />
          <DisplayDataColumn
            data={[
              {
                text: "Swift Partner",
                value: user.data?.content.isSwift ? "✅" : "❌",
              },
              {
                text: "active",
                value: user.data?.content.active ? "✅" : "❌",
              },
              {
                text: "client id",
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
        </div>

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
        <div className="col-sm-12 -col-md-12 col-lg-12">
          <SectionHeader title={"Business Documents"} />
          <DisplayDataColumn
            data={[
              {
                text: "citizenship",
                value: user.data?.content?.businessDetails?.citizenship,
              },
              {
                text: "passport number",
                value: user.data?.content?.businessDetails?.passportNumber,
              },
              {
                text: "federal ID number",
                value: user.data?.content?.businessDetails?.federalNumber,
              },
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

        <Section>
          <div className="text-center">
            <SectionHeader title={"Authorized Signature"} />
            <img src={user.data?.content?.businessDetails?.signature} />
          </div>
        </Section>
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

export default ViewSwiftUser;
