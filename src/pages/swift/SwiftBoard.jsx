import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { RefreshCcw, RefreshCw, Search } from "react-feather";
import Skeleton from "react-loading-skeleton";
import { ActionMenu } from "../../components/ActionMenu";
import { PageContent } from "../../components/PageContent";
import { Section } from "../../components/Section";
import { Button, ButtonGroup } from "../../components/buttons/Button";
import { StatsCard } from "../../components/cards/statsCard";
import { Data, Row, Table } from "../../components/table/table";
import { SignatureCapture } from "../../components/SignatureCapture";
import { COUNTRIES } from "../../consts/countries";

import TermsAndConditions from "../../static/relay_aggreement.pdf";

import { useSelector } from "react-redux";

import { toast } from "react-toastify";
import { DisplayDataColumn } from "../../components/DisplayData";
import { SectionHeader } from "../../components/SectionHeader";
import { Spinner } from "../../components/spinner";
import { useUser } from "../../hooks/useUser";
import { useForm } from "react-hook-form";
import { SwiftRegister, fetchUsers } from "../../api/api-service";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import { StatusBadge } from "../../components/utils/StatusBadge";
import { format } from "date-fns";
import { DATE_FORMAT } from "../../consts/AppContants";

export const SwiftOnboardingPage = () => {
  const currentUser = useSelector((s) => s.auth.currentUser);
  const [currentRecord, setCurrentRecord] = useState(null);

  const query = useQuery({
    queryKey: ["users/list"],
    queryFn: () =>
      fetchUsers({
        role: "USER",
        isSwift: true,
        // client: currentUser?._id,
      }),
    enabled: false,
  });

  const SwiftRegisterMutation = useMutation({
    mutationFn: SwiftRegister,
    onSuccess: (res) => {},
    onError: () => {},
  });

  if (!currentUser?.isSwift)
    return <Navigate to={ROUTES.DASHBOARD.SWIFT.ONBOARDING} />;

  return (
    <PageContent>
      {/* Page Header */}
      <Section>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h3 className="fw-light">Swift Services Partner</h3>
          <ButtonGroup>
            <ActionMenu
              name={"Relay"}
              options={[
                {
                  name: "DLC",
                  onClick: () => {
                    setCurrentRecord();
                  },
                },
                {
                  name: "SBLC",
                  onClick: () => {
                    setCurrentRecord();
                  },
                },
                {
                  name: "PBG",
                  onClick: () => {
                    setCurrentRecord();
                  },
                },
              ]}
              text={"Relay"}
            />
            <Button
              className="btn btn-light"
              text={"Issue"}
              onClick={() => {}}
            />
            <Button
              className="btn btn-light"
              text={"Upload"}
              onClick={() => {}}
            />
            <Button
              className="btn btn-primary"
              text={"Download"}
              onClick={() => {}}
            />
          </ButtonGroup>
        </div>
      </Section>

      <Section>
        <Table
          loading={false}
          cols={[
            "active",
            "status",
            "created at",
            "id",
            "first name",
            "last name",
            "profile type",
            "email",
          ]}
          dataSize={0}
        >
          {/* =============== Display Data from API =============*/}
          {query?.data?.content?.map((item, i) => (
            <>
              <Row className="bg-danger">
                <Data>{item.active ? "🟢" : "🔴"}</Data>
                <Data>
                  <span className="text-capitalize">
                    <StatusBadge status={item.status} />
                  </span>
                </Data>
                <Data>{format(item?.createdAt, DATE_FORMAT)}</Data>
                <Data>
                  <span className="text-primary fw-bold user-select-all">
                    {item.userId}
                  </span>
                </Data>
                <Data>{item.firstName}</Data>
                <Data>{item.lastName}</Data>
                <Data>
                  <span className="text-uppercase">{item.accountType}</span>
                </Data>
                <Data>
                  <span className="user-select-all">{item.email}</span>
                </Data>
              </Row>
            </>
          ))}
          {/* show empty list */}
        </Table>
      </Section>
    </PageContent>
  );
};

export default SwiftOnboardingPage;
