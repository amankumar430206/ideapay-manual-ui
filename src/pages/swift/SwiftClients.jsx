import React, { useState } from "react";
import { Button } from "../../components/buttons/Button";
import { PageContent } from "../../components/PageContent";
import { Section } from "../../components/Section";
import { Table, Row, Data } from "../../components/table/table";
import { Search } from "react-feather";
import { StatsCard } from "../../components/cards/statsCard";
import { ActionMenu } from "../../components/ActionMenu";
import {
  UpdateUserStatus,
  fetchUserStats,
  fetchUsers,
} from "../../api/api-service";
import { StatusBadge } from "../../components/utils/StatusBadge";
import ViewSwiftUserDrawer from "./ViewSwiftClient";

import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getFormValues } from "../../utils/utils";
import Skeleton from "react-loading-skeleton";
import { STATUS_ENUMS } from "../../consts/formValues";
import { DATE_FORMAT } from "../../consts/AppContants";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const filterOptions = [
  {
    name: "all",
    value: "",
  },
  {
    name: "pending",
    value: "pending",
  },
  {
    name: "approved",
    value: "approved",
  },
  {
    name: "rejected",
    value: "rejected",
  },
];

const Page = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((s) => s.auth.currentUser);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [filter, setFilter] = useState(filterOptions[0]);

  const [searchQuery, setSearchQuery] = useState("");

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  const query = useQuery({
    queryKey: ["users/list", filter.value, searchQuery],
    queryFn: () =>
      fetchUsers({
        role: "USER",
        status: filter.value,
        isSwift: true,
        searchQuery: searchQuery,
      }),
  });

  const userStatsQuery = useQuery({
    queryKey: ["users/stats"],
    queryFn: () =>
      fetchUserStats({
        isSwift: true,
      }),
  });

  const updateStatus = useMutation({
    mutationFn: UpdateUserStatus,
    onSuccess: (res) => {
      query.refetch();
    },
  });

  const handleStatusUpdate = (id, status) => {
    const actionConfirm = window.confirm("Please Confirm!");
    if (actionConfirm)
      updateStatus.mutate({
        status: status,
        userId: id,
      });
  };

  const handleSearch = (e) => {
    const formValues = getFormValues(e);
    setSearchQuery(formValues.search);
  };

  return (
    <PageContent>
      {/* Page Header */}
      <Section>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h3 className="fw-light">Swift Clients</h3>
        </div>
      </Section>

      <Section>
        <PageStatistics
          data={userStatsQuery.data?.content}
          loading={userStatsQuery.isLoading}
        />
      </Section>

      <Section className={"mt-5"}>
        <nav className="nav">
          {filterOptions.map((item) => (
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

      <Section className="mt-5">
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4">
            <form onSubmit={handleSearch}>
              <label className="form-label">Search Accounts</label>
              <div className="input-group">
                <input
                  type="text"
                  name="search"
                  className="form-control"
                  placeholder="RXXXXXXX"
                />
                <button className="btn btn-light" type="submit">
                  <Search size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </Section>

      <Section>
        <Table
          loading={query?.isLoading}
          cols={[
            "status",
            "created at",
            "id",
            "first name",
            "last name",
            "profile type",
            "email",
            "view",
          ]}
          dataSize={query?.data?.content?.length}
        >
          {/* =============== Display Data from API =============*/}
          {query?.data?.content?.map((item, i) => (
            <>
              <Row className="bg-danger">
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
                <Data>
                  <Button
                    className="btn btn-link"
                    text={"View Details"}
                    onClick={() => {
                      setCurrentRecord(item);
                      setIsViewOpen(true);
                    }}
                  />
                </Data>
              </Row>
            </>
          ))}
          {/* show empty list */}
        </Table>
      </Section>

      {/* actions and drawers */}

      {isViewOpen && (
        <ViewSwiftUserDrawer
          data={currentRecord}
          onClose={() => {
            setIsViewOpen(false);
          }}
        />
      )}
    </PageContent>
  );
};

const PageStatistics = ({ loading, data }) => {
  return (
    <>
      {loading ? (
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
                <StatsCard
                  text="Total Swift Clients"
                  value={data?.totalUsers || 0}
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3">
                <StatsCard
                  text="Total Swift Active Clients"
                  value={data?.totalActiveUsers || 0}
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3">
                <StatsCard
                  text="Total Swift Pending Clients"
                  value={data?.totalPendingUsers || 0}
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3">
                <StatsCard
                  text="Total Swift Accounts"
                  value={data?.totalPendingUsers || 0}
                />
              </div>
            </div>
          </Section>
        </>
      )}
    </>
  );
};

export default Page;
