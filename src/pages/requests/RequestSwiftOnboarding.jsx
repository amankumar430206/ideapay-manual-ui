import React, { useState } from "react";
import { Button, ButtonGroup } from "../../components/buttons/Button";
import { PageContent } from "../../components/PageContent";
import { Section } from "../../components/Section";
import { Table, Row, Data } from "../../components/table/table";
import { Check, CheckCircle, Search } from "react-feather";
import { StatsCard } from "../../components/cards/statsCard";
import { ActionMenu } from "../../components/ActionMenu";
import { useMutation, useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import {
  formatAmount,
  getAmountWithCurrency,
  getFormValues,
  getFormattedDate,
} from "../../utils/utils";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import {
  ApproveAccountTransaction,
  ApprovePrefunRequest,
  UpdatePrefundStatus,
  UpdateTransactionStatus,
  fetchAccounts,
  fetchPrefundRequests,
  fetchTransactions,
} from "../../api/api-service";
import { useSelector } from "react-redux";
import { ROLES } from "../../consts/AppRoles";
import { STATUS_ENUMS, TRANSFER_TYPE } from "../../consts/formValues";
import { formatDate } from "date-fns";
import { DATE_FORMAT } from "../../consts/AppContants";
import { format } from "date-fns";
import { StatusBadge } from "../../components/utils/StatusBadge";
import { OnlyForAdmin, OnlyForUser, permitUser } from "../../components/Roles";
import { StatusFilterOptions } from "../../consts/formValues";
import { ViewPrefundRequestDrawer } from "./actions/ViewPrefundRequestDrawer";
import { ApprovePrefundRequestDrawer } from "./actions/ApprovePrefundRequestDrawer";

export const RequestSwiftOnboarding = () => {
  const location = useLocation();

  const [currentRecord, setCurrentRecord] = useState(null);
  const [isViewOpen, setViewOpen] = useState(false);
  const [isApproveOpen, setApproveOpen] = useState(false);

  const currentUser = useSelector((s) => s.auth.currentUser);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState(StatusFilterOptions[0]);
  const handleSearch = (e) => {
    const formValues = getFormValues(e);
    setSearchQuery(formValues.search);
  };

  // choose the current account on view
  const [IsAccountSelectOpen, setIsAccountSelectOpen] = useState(false);

  const query = useQuery({
    queryKey: ["requests", searchQuery, filter],
    queryFn: () =>
      fetchPrefundRequests({
        query: {
          status: filter.value,
          requestId: searchQuery,
          requestedBy: currentUser?.role === ROLES.USER ? currentUser?._id : "",
        },
        populate: "account requestedBy",
      }),
  });

  const UpdateStatusMutation = useMutation({
    mutationFn: UpdatePrefundStatus,
    onSuccess: (res) => {
      query.refetch();
    },
  });

  const handleStatusUpdate = (requestId, status) => {
    const confirm = window.confirm("Please Confirm!");
    if (confirm)
      UpdateStatusMutation.mutate({
        requestId: requestId,
        status: status,
      });
  };

  return (
    <>
      <PageContent>
        {/* Page Header */}
        <Section>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <h3 className="fw-light">Requests</h3>
          </div>
          <h5 className="mt-3">Swift Onboarding</h5>
        </Section>

        <Section className={"mt-5"}></Section>

        {/* Search Section */}
        <Section>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-4">
              <div className="d-flex">
                <div className="w-100">
                  <form onSubmit={handleSearch}>
                    <label className="form-label">Search Accounts</label>
                    <div className="input-group">
                      <input
                        type="search"
                        name="search"
                        className="form-control"
                        placeholder="RXXXXXXX"
                      />
                      <Button className="btn btn-light" type="submit">
                        <Search size={16} />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Section>
        <Section>
          <Table
            loading={query?.isLoading}
            cols={[
              "status",
              "request id",
              "request date",
              "requester id",
              "requester name",
              "account no.",
              "acc. balance",
              "currency",
              "requested amount",
              "approved amount",
              "Description",
              "action",
            ]}
            dataSize={query.data?.content.length}
          >
            {/* =============== Display Data from API =============*/}
            {query.data?.content.map((item) => (
              <>
                <Row>
                  <Data>
                    <StatusBadge status={item.status} />
                  </Data>
                  <Data>{item?.requestId}</Data>
                  <Data>{format(item?.createdAt, DATE_FORMAT)}</Data>
                  <Data>
                    {item?.requestedBy?._id
                      ? `${item?.requestedBy?.userId}`
                      : "-"}
                  </Data>
                  <Data>
                    {item?.requestedBy?._id
                      ? `${item?.requestedBy?.firstName} ${item?.requestedBy?.lastName}`
                      : "-"}
                  </Data>
                  <Data>{item?.account?.accountNo}</Data>
                  <Data>
                    {getAmountWithCurrency(
                      formatAmount(item?.account?.balance),
                      item?.account?.currency
                    )}
                  </Data>
                  <Data>{item?.account?.currency}</Data>
                  <Data>{formatAmount(item?.amount)}</Data>
                  <Data>{formatAmount(item?.approvedAmount)}</Data>
                  <Data>{item?.description}</Data>
                  <Data>
                    <OnlyForAdmin role={currentUser?.role}>
                      <ActionMenu
                        options={[
                          {
                            name: "View Request",
                            onClick: () => {
                              setCurrentRecord(item);
                              setViewOpen(true);
                            },
                          },
                          {
                            name: "Approve & Process",
                            show: item.status === STATUS_ENUMS.PENDING,
                            onClick: () => {
                              setCurrentRecord(item);
                              setApproveOpen(true);
                            },
                          },
                          {
                            name: "Reject Request",
                            show: item.status === STATUS_ENUMS.PENDING,
                            onClick: () => {
                              handleStatusUpdate(
                                item?._id,
                                STATUS_ENUMS.REJECTED
                              );
                            },
                          },
                        ]}
                      />
                    </OnlyForAdmin>
                  </Data>
                </Row>
              </>
            ))}
            {/* show empty list */}
          </Table>
        </Section>
      </PageContent>

      {/* Drawers and modals */}
      {isViewOpen && (
        <ViewPrefundRequestDrawer
          data={currentRecord}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      )}

      {isApproveOpen && (
        <ApprovePrefundRequestDrawer
          data={currentRecord}
          onClose={() => {
            setApproveOpen(false);
            query.refetch();
          }}
        />
      )}
    </>
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

export default RequestSwiftOnboarding;
