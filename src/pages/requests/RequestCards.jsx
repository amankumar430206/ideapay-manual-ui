import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useState } from "react";
import { Search } from "react-feather";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  UpdateCardRequestStatus,
  UpdatePrefundStatus,
  fetchCardRequests,
} from "../../api/api-service";
import { ActionMenu } from "../../components/ActionMenu";
import { PageContent } from "../../components/PageContent";
import { OnlyForAdmin } from "../../components/Roles";
import { useCan } from "../../hooks/useCan";
import { Section } from "../../components/Section";
import { Button } from "../../components/buttons/Button";
import { Data, Row, Table } from "../../components/table/table";
import { StatusBadge } from "../../components/utils/StatusBadge";
import { DATE_FORMAT } from "../../consts/AppContants";
import { ROLES } from "../../consts/AppRoles";
import { STATUS_ENUMS, StatusFilterOptions } from "../../consts/formValues";
import { getFormValues } from "../../utils/utils";
import { ApprovePrefundRequestDrawer } from "./actions/ApprovePrefundRequestDrawer";
import { ViewCardRequestDrawer } from "./actions/ViewCardRequestDrawer";

const RequestCardPage = () => {
  const location = useLocation();

  const [currentRecord, setCurrentRecord] = useState(null);
  const [isViewOpen, setViewOpen] = useState(false);
  const [isApproveOpen, setApproveOpen] = useState(false);

  const currentUser = useSelector((s) => s.auth.currentUser);
  const can = useCan();

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
      fetchCardRequests({
        query: {
          status: filter.value,
          requestId: searchQuery,
          requestedBy: currentUser?.role === ROLES.USER ? currentUser?._id : "",
        },
        populate: "requestedBy",
      }),
  });

  const UpdateStatusMutation = useMutation({
    mutationFn: UpdateCardRequestStatus,
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
          <h5 className="mt-3">Card Service</h5>
        </Section>

        <Section className={"mt-5"}>
          <nav className="nav">
            {StatusFilterOptions.map((item) => (
              <button
                className={`nav-link text-capitalize px-4 border ${
                  item.name === filter.name && "text-light bg-primary"
                }`}
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
                    <label className="form-label">Search</label>
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
                            show:
                              item.status === STATUS_ENUMS.PENDING &&
                              can("requests.card_requests.approve"),
                            onClick: () => {
                              handleStatusUpdate(
                                item?._id,
                                STATUS_ENUMS.APPROVED
                              );
                            },
                          },
                          {
                            name: "Reject Request",
                            show:
                              item.status === STATUS_ENUMS.PENDING &&
                              can("requests.card_requests.approve"),
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
        <ViewCardRequestDrawer
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

export default RequestCardPage;
