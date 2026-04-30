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
  RequestAccountActivationList,
  UpdateRequestAccountStatus,
  UpdateTransactionStatus,
  fetchAccounts,
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
import { toast } from "react-toastify";

const RequestAccountActivation = () => {
  const location = useLocation();

  const [currentRecord, setCurrentRecord] = useState(null);

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
    queryKey: ["requests/accounts/activation", searchQuery, filter],
    queryFn: () =>
      RequestAccountActivationList({
        query: {
          status: filter.value,
          transactionId: searchQuery,
          requestedBy: currentUser?.role === ROLES.USER ? currentUser?._id : "",
        },
        populate: "account requestedBy",
      }),
  });

  const Mutation = useMutation({
    mutationFn: UpdateRequestAccountStatus,
    onSuccess: (res) => {
      query.refetch();
    },
  });

  const handleStatusUpdate = (requestId, status) => {
    const confirm = window.confirm(
      "Are you sure receipt is uploaded and verified ?"
    );
    if (confirm) {
      Mutation.mutate({
        requestId: requestId,
        status: status,
      });
    }
  };

  return (
    <PageContent>
      {/* Page Header */}
      <Section>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h3 className="fw-light">Requests</h3>
        </div>
        <h5 className="mt-3">Account Activation</h5>
      </Section>

      <Section className={"mt-4"}>
        <nav className="nav">
          {StatusFilterOptions.map((item) => (
            <button
              className={`nav-link text-capitalize px-4 border ${
                item.name === filter.name && "text-light bg-primary"
              }`}
              href="#"
              onClick={() => setFilter(item)}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </Section>

      {/* Search Section */}
      <Section>
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="d-flex">
              <div className="w-100">
                <form onSubmit={handleSearch}>
                  <label className="form-label">Search Request</label>
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
            "date",
            "account status",
            "account no",
            "requester id",
            "requester name",
            "approver id",
            "country",
            "reference no",
            "View Document",
            "View Receipt",
            "action",
          ]}
          dataSize={query.data?.content?.length}
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
                  <StatusBadge status={item.account?.status} />
                </Data>
                <Data>{item?.account?.accountNo}</Data>
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
                <Data>
                  {item?.approvedBy?._id ? `${item?.approvedBy?.userId}` : "-"}
                </Data>
                <Data>{item?.country}</Data>
                <Data>{item?.referenceNo}</Data>
                <Data>
                  {item?.documentPdf ? (
                    <a
                      href={item?.documentPdf}
                      className="btn btn-link"
                      target="_blank"
                    >
                      View Document
                    </a>
                  ) : (
                    <Button
                      disabled={!item?.documentPdf}
                      className="btn btn-link"
                    >
                      View Document
                    </Button>
                  )}
                </Data>
                <Data>
                  {item?.receipt ? (
                    <a
                      href={item?.receipt}
                      className="btn btn-link"
                      target="_blank"
                    >
                      View Receipt
                    </a>
                  ) : (
                    <Button disabled={!item?.receipt} className="btn btn-link">
                      View Receipt
                    </Button>
                  )}
                </Data>
                <Data>
                  <OnlyForAdmin role={currentUser?.role}>
                    <ActionMenu
                      disabled={item.status === STATUS_ENUMS.APPROVED}
                      options={[
                        {
                          name: "View Request",
                          onClick: () => {
                            toast("Feature Coming Soon..");
                          },
                        },
                        {
                          name: "Approve Request",
                          show: item.status === STATUS_ENUMS.PENDING,
                          onClick: () => {
                            handleStatusUpdate(
                              item?._id,
                              STATUS_ENUMS.APPROVED
                            );
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

export default RequestAccountActivation;
