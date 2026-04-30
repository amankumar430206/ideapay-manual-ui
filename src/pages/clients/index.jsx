import React, { useState } from "react";
import { Search } from "react-feather";
import {
  UpdateUserStatus,
  fetchUserStats,
  fetchUsers,
} from "../../api/api-service";
import { ActionMenu } from "../../components/ActionMenu";
import { PageContent } from "../../components/PageContent";
import { Section } from "../../components/Section";
import { Button, ButtonGroup } from "../../components/buttons/Button";
import { StatsCard } from "../../components/cards/statsCard";
import { Data, Row, Table } from "../../components/table/table";
import { StatusBadge } from "../../components/utils/StatusBadge";

import { useMutation, useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { STATUS_ENUMS } from "../../consts/formValues";
import { getFormValues } from "../../utils/utils";
import { ROLES } from "../../consts/AppRoles";
import { OnlyFor } from "../../components/Roles";

import { format } from "date-fns";
import { DATE_FORMAT } from "../../consts/AppContants";
import AddAccountDrawer from "../accounts/actions/AddAccountDrawer";
import AddTransactionDrawer from "./actions/AddTransactionDrawer";
import UserRegisterDrawer from "./actions/UserOnboardDrawer";
import ViewUserDrawer from "./actions/ViewUserDrawer";

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
  const currentUser = useSelector((s) => s.auth.currentUser);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [filter, setFilter] = useState(filterOptions[0]);

  const [searchQuery, setSearchQuery] = useState("");

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  const query = useQuery({
    queryKey: ["users/list", filter.value, searchQuery],
    queryFn: () =>
      fetchUsers({
        role: "USER",
        status: filter.value,
        // client: currentUser?._id,
        searchQuery: searchQuery,
      }),
  });

  const userStatsQuery = useQuery({
    queryKey: ["users/stats"],
    queryFn: () =>
      fetchUserStats({
        isSwift: "",
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
    console.log(formValues);

    setSearchQuery(formValues.search);
  };

  return (
    <PageContent>
      {/* Page Header */}
      <Section>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h3 className="fw-light">Clients</h3>
          <ButtonGroup>
            <OnlyFor roles={[ROLES.SUPER]}>
              <Button
                className="btn btn-outline-primary"
                text={"+ Add Transaction"}
                onClick={() => {
                  setCurrentRecord(null);
                  setIsAddTransactionOpen(true);
                }}
              />
            </OnlyFor>
            <Button
              className="btn btn-primary"
              text={"+ Add Client"}
              onClick={() => {
                setIsRegisterOpen(true);
              }}
            />
          </ButtonGroup>
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
              href="#"
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
            "accounts",
            "actions",
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
                <Data>
                  <Button
                    disabled={!item.active}
                    className="btn btn-light"
                    text={" + Add Currency"}
                    onClick={() => {
                      setCurrentRecord(item);
                      setIsAddAccountOpen(true);
                    }}
                  />
                </Data>
                <Data>
                  <ActionMenu
                    options={[
                      {
                        name: "Add Transaction",
                        show: currentUser?.role === ROLES.SUPER,
                        onClick: () => {
                          setCurrentRecord(item);
                          setIsAddTransactionOpen(true);
                        },
                      },
                      {
                        name: "Approve",
                        show:
                          !(item.status === STATUS_ENUMS.APPROVED) ||
                          !item.businessDetails,
                        onClick: () => {
                          setCurrentRecord(item);
                          handleStatusUpdate(item._id, STATUS_ENUMS.APPROVED);
                        },
                      },
                      {
                        name: "Reject",
                        show: !(item.status === STATUS_ENUMS.REJECTED),
                        onClick: () => {
                          setCurrentRecord(item);
                          handleStatusUpdate(item._id, STATUS_ENUMS.REJECTED);
                        },
                      },
                      {
                        name: "Block",
                        show: !(item.status === STATUS_ENUMS.BLOCKED),
                        onClick: () => {
                          setCurrentRecord(item);
                          handleStatusUpdate(item._id, STATUS_ENUMS.BLOCKED);
                        },
                      },
                    ]}
                  />
                </Data>
              </Row>
            </>
          ))}
          {/* show empty list */}
        </Table>
      </Section>

      {/* Action Drawers */}
      {isRegisterOpen && (
        <UserRegisterDrawer
          data={currentRecord}
          onClose={() => {
            setIsRegisterOpen(false);
            query.refetch();
          }}
        />
      )}

      {isAddAccountOpen && (
        <AddAccountDrawer
          data={currentRecord}
          onClose={() => {
            setIsAddAccountOpen(false);
            query.refetch();
          }}
        />
      )}

      {isViewOpen && (
        <ViewUserDrawer
          data={currentRecord}
          onClose={() => {
            setIsViewOpen(false);
          }}
        />
      )}

      {isAddTransactionOpen && (
        <AddTransactionDrawer
          onClose={() => {
            setIsAddTransactionOpen(false);
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
                <StatsCard text="Total Clients" value={data?.totalUsers || 0} />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3">
                <StatsCard
                  text="Total Active Clients"
                  value={data?.totalActiveUsers || 0}
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3">
                <StatsCard
                  text="Total Pending Clients"
                  value={data?.totalPendingUsers || 0}
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3">
                <StatsCard
                  text="Total Active Accounts"
                  value={data?.totalActiveAccounts || 0}
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
