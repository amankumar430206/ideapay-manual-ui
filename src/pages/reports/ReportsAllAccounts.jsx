import React, { useState } from "react";
import { Button, ButtonGroup } from "../../components/buttons/Button";
import { PageContent } from "../../components/PageContent";
import { Section } from "../../components/Section";
import { Table, Row, Data } from "../../components/table/table";
import { Check, CheckCircle, Search } from "react-feather";
import { StatsCard } from "../../components/cards/statsCard";
import { ActionMenu } from "../../components/ActionMenu";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import { formatAmount, getAmountWithCurrency } from "../../utils/utils";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../../router/routes";

export const ReportsPage = () => {
  const location = useLocation();
  const [currentRecord, setCurrentRecord] = useState(null);

  // choose the current account on view
  const [IsAccountSelectOpen, setIsAccountSelectOpen] = useState(false);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isTransferAccountsOpen, setisTransferAccountsOpen] = useState(false);
  const [isTransferUserOpen, setisTransferUserOpen] = useState(false);
  const [isCardFundOpen, setIsCardFundOpen] = useState(false);
  const [isOutWireOpen, setisOutWireOpen] = useState(false);
  const [isInWireOpen, setisInWireOpen] = useState(false);

  return (
    <PageContent>
      {/* Page Header */}
      <Section>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h3 className="fw-light">Reports | All Accounts</h3>
          <ButtonGroup>
            <ActionMenu
              name="Transfer"
              options={[
                {
                  name: "Transfer Accounts",
                  show: true,
                  onClick: () => {
                    setisTransferAccountsOpen(true);
                  },
                },
                {
                  name: "Transfer Users",
                  show: true,
                  onClick: () => {
                    setisTransferUserOpen(true);
                  },
                },
                {
                  name: "Card Funding Transfer",
                  show: true,
                  onClick: () => {
                    setIsCardFundOpen(true);
                  },
                },
                {
                  name: "Outgoing Wire Transfer",
                  show: true,
                  onClick: () => {
                    setisOutWireOpen(true);
                  },
                },
                {
                  name: "Incoming Wire Transfer",
                  show: true,
                  onClick: () => {
                    setisInWireOpen(true);
                  },
                },
              ]}
            />
            <Button
              className="btn btn-primary"
              text={"+ Transfer Amount"}
              onClick={() => {
                setisTransferAccountsOpen(true);
              }}
            />
          </ButtonGroup>
        </div>
      </Section>

      <Section>
        <PageStatistics />
      </Section>

      {/* Search Section */}
      <Section className="mt-5">
        <div className="row">
          <div className="col-sm-12 col-md-4 col-lg-4">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
              />
              <button
                className="btn btn-light"
                type="button"
                id="button-addon1"
              >
                <Search size={16} />
              </button>
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <Table
          loading={false}
          cols={[
            "date",
            "status",
            "transaction id",
            "Description",
            "debit/credit",
            "current balance",
            "action",
          ]}
          dataSize={1}
        >
          {/* =============== Display Data from API =============*/}
          {[1].map((item) => (
            <>
              <Row>
                <Data>-</Data>
                <Data>-</Data>
                <Data>-</Data>
                <Data>-</Data>
                <Data>-</Data>
                <Data>-</Data>
                <Data>
                  <button
                    className="btn btn-link"
                    onClick={() => setIsViewOpen(true)}
                  >
                    View
                  </button>
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

const PageStatistics = () => {
  const pageStatQuery = useQuery({
    queryKey: [],
    queryFn: () => null,
  });

  return (
    <>
      {pageStatQuery.isLoading ? (
        <>
          <Section>
            <div className="row gy-3">
              <div className="col-sm-12 col-md-6 col-lg-3">
                <Skeleton height={120} />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3">
                <Skeleton height={120} />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3">
                <Skeleton height={120} />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3">
                <Skeleton height={120} />
              </div>
            </div>
          </Section>
        </>
      ) : (
        <>
          <Section>
            <div className="row gy-3">
              <div className="col-sm-12 col-md-6 col-lg-3">
                <StatsCard text="Account No." value={"-"} />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3">
                <StatsCard
                  text="Current Balance"
                  value={getAmountWithCurrency(formatAmount(0), "USD")}
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3">
                <StatsCard text="Account Type" value={"-"} />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3">
                <StatsCard text="Currency" value={"-"} />
              </div>
            </div>
          </Section>
        </>
      )}
    </>
  );
};

export default ReportsPage;
