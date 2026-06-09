import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { Search } from "react-feather";
import Skeleton from "react-loading-skeleton";
import { ActionMenu } from "../../components/ActionMenu";
import { PageContent } from "../../components/PageContent";
import { Section } from "../../components/Section";
import { Button, ButtonGroup } from "../../components/buttons/Button";
import { StatsCard } from "../../components/cards/statsCard";
import { Data, Row, Table } from "../../components/table/table";
import { formatAmount, getAmountWithCurrency, getFormValues } from "../../utils/utils";
// actions
import { useSelector } from "react-redux";
import Stepper from "react-stepper-horizontal";
import { fetchAccountStats } from "../../api/api-service";
import { OnlyInMobile, OnlyInPc } from "../../components/Responsive";
import { OnlyFor, OnlyForAdmin, OnlyForUser, permitUser } from "../../components/Roles";
import { Can } from "../../components/permission/Can";
import { useCan } from "../../hooks/useCan";
import { Spinner } from "../../components/spinner";
import { StatusBadge } from "../../components/utils/StatusBadge";
import { ROLES } from "../../consts/AppRoles";
import { KYC_STATUS, STATUS_ENUMS } from "../../consts/formValues";
import { useAccounts } from "../../hooks/useAccounts";
import { useUser } from "../../hooks/useUser";
import { AccountSwitchDrawer } from "./AccountSelectDrawer";
import { PoolAccountSwitchDrawer } from "./PoolAccountSelectDrawer";
import { PrefundRequestDrawer } from "./PrefunRequestDrawer";
import { TransferAccountsDrawer } from "./TransferAccountsDrawer";
import { TransferCardFundDrawer } from "./TransferCardFundDrawer";
import { TransferInWireDrawer } from "./TransferInWireDrawer";
import { TransferOutWireDrawer } from "./TransferOutWireDrawer";
import { TransferUsersDrawer } from "./TransferUsersDrawer";
import { ViewTransactionDrawer } from "./ViewTransactionDrawer";
import ActivateAccountDrawer from "./actions/ActivateAccountDrawer";
import AddAccountDrawer from "./actions/AddAccountDrawer";
import KYCFormDrawer from "./actions/KYCFormDrawer";
import UpdateBalanceDrawer from "./actions/UpdateBalanceDrawer";
import UploadReceiptDrawer from "./actions/UploadReceiptDrawer";
import ViewAccountDrawer from "./actions/ViewAccountDrawer";
import RequestTransactionDrawer from "./actions/RequestTransactionDrawer";

export const AccountsPage = () => {
  const currentUser = useSelector((s) => s.auth.currentUser);
  const can = useCan();
  const [currentRecord, setCurrentRecord] = useState(null);

  // choose the current account on view
  const [IsAccountSelectOpen, setIsAccountSelectOpen] = useState(false);
  const [isPoolAccountOpen, setIsPoolAccountOpen] = useState(false);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isTransferAccountsOpen, setisTransferAccountsOpen] = useState(false);
  const [isPrefundReqOpen, setPrefundOpen] = useState(false);
  const [isTransferUserOpen, setisTransferUserOpen] = useState(false);
  const [isCardFundOpen, setIsCardFundOpen] = useState(false);
  const [isOutWireOpen, setisOutWireOpen] = useState(false);
  const [isInWireOpen, setisInWireOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isActivateAccountOpen, setisActivateAccountOpen] = useState(false);
  const [isUploadReceiptOpen, setIsUploadReceiptOpen] = useState(false);
  const [isEditBalanceOpen, setIsEditBalanceOpen] = useState(false);
  const [isKYCFormOpen, setKYCFormOpen] = useState(false);
  const [isViewAccountOpen, setIsViewAccountOpen] = useState(false);
  const [isRequestTransactionOpen, setIsRequestTransactionOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const accountStatsQuery = useQuery({
    queryKey: ["accounts/stats"],
    queryFn: () =>
      fetchAccountStats({
        user: currentUser?.role === ROLES.USER ? currentUser?._id : "",
      }),
  });

  const query = useAccounts({
    query: {
      accountNo: searchQuery,
      user: currentUser?.role === ROLES.USER ? currentUser?._id : "",
    },
    populate: "user",
  });

  const { data: userData, isLoading, refetch: stepperQuery } = useUser({ id: currentUser._id });

  const handleSearch = (e) => {
    const formValues = getFormValues(e);
    setSearchQuery(formValues.search);
  };

  const getActiveStep = useCallback(
    (kycStatus) => {
      const steps = {
        [KYC_STATUS.PENDING]: 0,
        [KYC_STATUS.COMPLETED]: 0,
        [KYC_STATUS.UPLOAD_KYC]: 1,
        [KYC_STATUS.ACTIVATE_ACCOUNT]: 2,
        [KYC_STATUS.UPLOAD_RECEIPT]: 3,
      };
      return steps[kycStatus];
    },
    [userData?.content?.kycStatus],
  );

  return (
    <PageContent>
      {/* Page Header */}

      {isLoading ? (
        <Spinner />
      ) : (
        <OnlyFor roles={[ROLES.CLIENT, ROLES.USER]}>
          {userData?.content?.kycStatus !== KYC_STATUS.COMPLETED && (
            <Section className={"mb-5"}>
              <h6 className="text-center">Account Activation Pending Processes</h6>
              <Stepper
                completeColor="#90be6d"
                activeColor="#1F0751"
                activeStep={getActiveStep(userData?.content?.kycStatus)}
                steps={[
                  {
                    title: "Registration",
                  },
                  {
                    title:
                      currentUser.kycStatus === KYC_STATUS.UPLOAD_KYC ? (
                        <a
                          className="btn btn-link text-capitalize"
                          onClick={() => {
                            if (currentUser.role !== ROLES.ADMIN) setCurrentRecord(currentUser);
                            setKYCFormOpen(true);
                          }}
                        >
                          Upload KYC Documents
                        </a>
                      ) : (
                        <span className="text-capitalize">Upload KYC Documents ({currentUser?.status})</span>
                      ),
                  },
                  {
                    title:
                      userData?.content?.kycStatus === KYC_STATUS.ACTIVATE_ACCOUNT ? (
                        <a
                          className="btn btn-link text-capitalize"
                          onClick={() => {
                            if (currentUser.role !== ROLES.ADMIN) setCurrentRecord(currentUser);
                            setisActivateAccountOpen(true);
                          }}
                        >
                          Activation Fee
                        </a>
                      ) : (
                        <span className="text-capitalize">Activation Fee</span>
                      ),
                  },
                  {
                    title:
                      userData?.content?.kycStatus === KYC_STATUS.UPLOAD_RECEIPT ? (
                        <a
                          className="btn btn-link text-capitalize"
                          onClick={() => {
                            if (currentUser.role !== ROLES.ADMIN) setCurrentRecord(currentUser);
                            setIsUploadReceiptOpen(true);
                          }}
                        >
                          Upload Receipt
                        </a>
                      ) : (
                        <span className="text-capitalize">Upload Receipt</span>
                      ),
                  },
                ]}
              />
            </Section>
          )}
        </OnlyFor>
      )}

      {!query.data?.content.length && (
        <>
          <Section className={"mb-5"}>
            <div className="alert alert-warning">
              <b>Attention</b> Account creation is mandatory for service access. Please upload your KYC and wait for 2
              hours for KYC verification. Take immediate action to proceed, as services cannot be accessed without an
              active account.
              <a
                className="btn btn-link"
                onClick={() => {
                  if (currentUser.role !== ROLES.ADMIN) setCurrentRecord(currentUser);
                  setKYCFormOpen(true);
                }}
              >
                Upload KYC Documents
              </a>
            </div>
          </Section>
        </>
      )}

      <Section>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h3 className="fw-light">Account & Balances</h3>

          <OnlyInMobile>
            <ButtonGroup>
              <OnlyForUser role={currentUser?.role}>
                <Button
                  id="accountBtn"
                  disabled={!currentUser?.active}
                  className="btn btn-light"
                  text={"Accounts & Balances"}
                  onClick={() => {
                    setIsAccountSelectOpen(true);
                  }}
                />
              </OnlyForUser>

              {/* transfer */}
              <ActionMenu
                disabled={!currentUser?.active}
                name="Transfer"
                options={[
                  {
                    name: "Self Transfer",
                    show: true,
                    onClick: () => {
                      setisTransferAccountsOpen(true);
                    },
                  },
                  {
                    name: "Other Accounts",
                    show: true,
                    onClick: () => {
                      setisTransferUserOpen(true);
                    },
                  },
                ]}
              />

              {/* other actions */}
              <ActionMenu
                name="Actions"
                disabled={!currentUser?.active}
                options={[
                  {
                    name: "Activate Account",
                    show:
                      currentUser?.role === ROLES.USER &&
                      can("accounts.accounts.edit"),
                    onClick: () => {
                      setCurrentRecord(currentUser);
                      setisActivateAccountOpen(true);
                    },
                  },
                  {
                    name: "+ Add Account",
                    show: can("accounts.accounts.create"),
                    onClick: () => {
                      if (currentUser.role !== ROLES.ADMIN) setCurrentRecord(currentUser);
                      setIsAddAccountOpen(true);
                    },
                  },
                  {
                    name: "+ Prefund Request",
                    onClick: () => {
                      if (currentUser.role !== ROLES.ADMIN) setCurrentRecord(currentUser);
                      setPrefundOpen(true);
                    },
                    show: false,
                  },
                ]}
              />
            </ButtonGroup>
          </OnlyInMobile>

          <OnlyInPc>
            <ButtonGroup>
              <OnlyForUser role={currentUser?.role}>
                <Button
                  show={false}
                  id="accountBtn"
                  disabled={!currentUser?.active}
                  className="btn btn-light"
                  text={"Accounts & Balances"}
                  onClick={() => {
                    setIsAccountSelectOpen(true);
                  }}
                />
              </OnlyForUser>

              <Can perm="payments.transaction_requests.create">
                <Button
                  className="btn btn-light"
                  text={"+ Payment Request"}
                  onClick={() => setIsRequestTransactionOpen(true)}
                />
              </Can>

              {/* transfer */}
              {/* <ActionMenu
                disabled={!currentUser?.active}
                name="Transfer"
                options={[
                  {
                    name: "Self Transfer",
                    show: true,
                    onClick: () => {
                      setisTransferAccountsOpen(true);
                    },
                  },
                  {
                    name: "Other Accounts",
                    show: true,
                    onClick: () => {
                      setisTransferUserOpen(true);
                    },
                  },
                ]}
              /> */}
              <Can perm="accounts.accounts.create">
                <Button
                  disabled={!currentUser?.active}
                  className="btn btn-primary"
                  text={"+ Add Account"}
                  onClick={() => {
                    if (currentUser.role !== ROLES.ADMIN) setCurrentRecord(currentUser);
                    setIsAddAccountOpen(true);
                  }}
                />
              </Can>
              <OnlyForUser role={currentUser?.role}>
                <Button
                  show={false}
                  disabled={!currentUser?.businessDetails}
                  className="btn btn-primary"
                  text={"Upload Receipt"}
                  onClick={() => {
                    setCurrentRecord(currentUser);
                    setIsUploadReceiptOpen(true);
                  }}
                />
                <Button
                  show={false}
                  disabled={!currentUser?.active}
                  className="btn btn-primary"
                  text={"+ Activate Account"}
                  onClick={() => {
                    setCurrentRecord(currentUser);
                    setisActivateAccountOpen(true);
                  }}
                />
              </OnlyForUser>
              <Button
                show={false}
                disabled={!currentUser?.active}
                className="btn btn-primary"
                text={"+ Prefund Request"}
                onClick={() => {
                  if (currentUser.role !== ROLES.ADMIN) setCurrentRecord(currentUser);
                  setPrefundOpen(true);
                }}
              />
            </ButtonGroup>
          </OnlyInPc>
        </div>
      </Section>

      <Section>
        <Statistics
          accountData={query?.data?.content}
          data={accountStatsQuery.data?.content}
          loading={accountStatsQuery.isLoading}
        />
      </Section>

      {/* Search Section */}
      <Section className="mt-4">
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="d-flex">
              <div className="w-100">
                <form onSubmit={handleSearch}>
                  <label className="form-label">Search Accounts</label>
                  <div className="input-group">
                    <input type="search" name="search" className="form-control" placeholder="RXXXXXXX" />
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
          loading={false}
          cols={[
            "status",
            "account no.",
            "account name",
            "user id",
            "owner",
            "type",
            "currency",
            "current balance",
            "action",
          ]}
          dataSize={query.data?.content.length}
        >
          {/* =============== Display Data from API =============*/}
          {query.data?.content.map((item) => (
            <>
              <Row>
                <Data>
                  <StatusBadge status={item?.status} />
                </Data>
                <Data>
                  <span className="text-primary fw-semibold user-select-all">{item?.accountNo}</span>
                </Data>
                <Data>{item?.accountName}</Data>
                <Data>{item?.user?.userId}</Data>
                <Data>
                  {item?.user?.firstName} {item?.user?.lastName}
                </Data>
                <Data>
                  <span className="badge bg-light text-dark border text-capitalize">{item?.accountType || "—"}</span>
                </Data>
                <Data>{item?.currency}</Data>
                <Data>
                  <span className="text-secondary fw-semibold user-select-all">{formatAmount(item?.balance)}</span>
                </Data>
                <Data>
                  <ActionMenu
                    options={[
                      {
                        name: "View Details",
                        show: true,
                        onClick: () => {
                          setCurrentRecord(item);
                          setIsViewAccountOpen(true);
                        },
                      },
                      {
                        name: "Activate Account",
                        show:
                          item.status !== STATUS_ENUMS.ACTIVE &&
                          permitUser([ROLES.ADMIN, ROLES.USER, ROLES.SUPER, ROLES.CLIENT], currentUser?.role) &&
                          can("accounts.accounts.edit"),
                        onClick: () => {
                          setCurrentRecord(item);
                          setisActivateAccountOpen(true);
                        },
                      },
                      {
                        name: "Update Balance",
                        show:
                          item.status === STATUS_ENUMS.ACTIVE &&
                          permitUser([ROLES.ADMIN], currentUser?.role) &&
                          can("accounts.accounts.edit"),
                        onClick: () => {
                          setCurrentRecord(item);
                          setIsEditBalanceOpen(true);
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

      {/* Actions & Modals */}
      {isAddAccountOpen && (
        <AddAccountDrawer
          data={currentRecord}
          onClose={() => {
            setIsAddAccountOpen(false);
            query.refetch();
            accountStatsQuery.refetch();
          }}
        />
      )}
      {isKYCFormOpen && (
        <KYCFormDrawer
          data={currentRecord}
          onClose={() => {
            setKYCFormOpen(false);
            query.refetch();
            accountStatsQuery.refetch();
            stepperQuery();
          }}
        />
      )}
      {isActivateAccountOpen && (
        <ActivateAccountDrawer
          data={currentRecord}
          onClose={() => {
            setisActivateAccountOpen(false);
            query.refetch();
            accountStatsQuery.refetch();
            stepperQuery();
          }}
        />
      )}

      {isUploadReceiptOpen && (
        <UploadReceiptDrawer
          data={currentRecord}
          onClose={() => {
            setIsUploadReceiptOpen(false);
            query.refetch();
            accountStatsQuery.refetch();
            stepperQuery();
          }}
        />
      )}

      {isEditBalanceOpen && (
        <UpdateBalanceDrawer
          data={currentRecord}
          onClose={() => {
            query.refetch();
            setIsEditBalanceOpen(false);
          }}
        />
      )}

      {isViewOpen && (
        <ViewTransactionDrawer
          data={currentRecord}
          onClose={() => {
            query.refetch();
            setIsViewOpen(false);
          }}
        />
      )}

      {isViewAccountOpen && <ViewAccountDrawer data={currentRecord} onClose={() => setIsViewAccountOpen(false)} />}

      {isRequestTransactionOpen && <RequestTransactionDrawer onClose={() => setIsRequestTransactionOpen(false)} />}

      {/* Transfer Actions */}
      {isTransferAccountsOpen && (
        <TransferAccountsDrawer
          data={currentRecord}
          onClose={() => {
            query.refetch();
            setisTransferAccountsOpen(false);
          }}
        />
      )}
      {isPrefundReqOpen && (
        <PrefundRequestDrawer
          data={currentRecord}
          onClose={() => {
            query.refetch();
            setPrefundOpen(false);
          }}
        />
      )}
      {isTransferUserOpen && (
        <TransferUsersDrawer
          data={currentRecord}
          onClose={() => {
            query.refetch();
            setisTransferUserOpen(false);
          }}
        />
      )}
      {isCardFundOpen && (
        <TransferCardFundDrawer
          data={currentRecord}
          onClose={() => {
            query.refetch();
            setIsCardFundOpen(false);
          }}
        />
      )}
      {isOutWireOpen && (
        <TransferOutWireDrawer
          data={currentRecord}
          onClose={() => {
            query.refetch();
            setisOutWireOpen(false);
          }}
        />
      )}
      {isInWireOpen && (
        <TransferInWireDrawer
          data={currentRecord}
          onClose={() => {
            query.refetch();
            setisInWireOpen(false);
          }}
        />
      )}
      {IsAccountSelectOpen && (
        <AccountSwitchDrawer
          data={query?.data?.content}
          onClose={() => {
            setIsAccountSelectOpen(false);
          }}
        />
      )}
      {isPoolAccountOpen && (
        <PoolAccountSwitchDrawer
          onClose={() => {
            setIsPoolAccountOpen(false);
          }}
        />
      )}
    </PageContent>
  );
};

const PageStatistics = ({ account = {} }) => {
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
                <StatsCard text="Account No." value={account?.accountNo} />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3">
                <StatsCard
                  text="Current Balance"
                  value={getAmountWithCurrency(formatAmount(account?.balance), account?.currency)}
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3">
                <StatsCard text="Account Type" value={"Corporate Trust"} />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3">
                <StatsCard text="Currency" value={"USD"} />
              </div>
            </div>
          </Section>
        </>
      )}
    </>
  );
};

const Statistics = ({ data, loading, accountData = [] }) => {
  const currentUser = useSelector((s) => s.auth.currentUser);

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
          {/* <Section>
            <div className="row gy-3">
              <OnlyForUser role={currentUser?.role}>
                <div className="col-sm-12 col-md-6 col-lg-3">
                  <StatsCard text="Account No." value={accountData[0] ? accountData[0]?.accountNo : "-"} />
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3">
                  <StatsCard
                    text="Account Balance"
                    value={getAmountWithCurrency(formatAmount(accountData[0]?.balance || 0), accountData[0]?.currency)}
                  />
                </div>
              </OnlyForUser>
              <div className="col-sm-12 col-md-6 col-lg-3">
                <StatsCard text="Total Accounts" value={data?.totalAccounts || 0} />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3">
                <StatsCard text="Active Accounts" value={data?.totalActiveAccounts || 0} />
              </div>
              <OnlyForAdmin role={currentUser?.role}>
                <div className="col-sm-12 col-md-6 col-lg-3">
                  <StatsCard text="Total Pending Accounts" value={data?.totalPendingAccounts || 0} />
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3">
                  <StatsCard text="Blocked Accounts" value={data?.totalBlockedAccounts || 0} />
                </div>
              </OnlyForAdmin>
            </div>
          </Section> */}

          <OnlyFor roles={[ROLES.CLIENT, ROLES.ADMIN, ROLES.USER]}>
            {accountData.length > 0 && (
              <Section className="mt-4">
                <div className="row gy-3">
                  {accountData.map((acc, i) => {
                    const gradients = [
                      "linear-gradient(135deg, #1F0751 0%, #3d1a8e 100%)",
                      "linear-gradient(135deg, #0f4c81 0%, #1a7abf 100%)",
                      "linear-gradient(135deg, #1a5c3a 0%, #27ae60 100%)",
                      "linear-gradient(135deg, #7b2d00 0%, #d35400 100%)",
                    ];
                    const bg = gradients[i % gradients.length];
                    return (
                      <div key={acc._id} className="col-sm-12 col-md-6 col-lg-4">
                        <div
                          className="card border-0 h-100 overflow-hidden"
                          style={{ background: bg, borderRadius: 12, minHeight: 120 }}
                        >
                          <div className="card-body d-flex flex-column justify-content-between p-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <p
                                  className="mb-0 text-white-50 text-uppercase"
                                  style={{ letterSpacing: "0.08em", fontSize: "0.62rem" }}
                                >
                                  {acc.accountType || "Account"}
                                </p>
                                <p className="mb-0 fw-semibold text-white" style={{ fontSize: "0.82rem" }}>
                                  {acc.accountName}
                                </p>
                              </div>
                              <span
                                style={{
                                  fontSize: "0.6rem",
                                  background: acc.status === "active" ? "rgba(255,255,255,0.2)" : "rgba(255,193,7,0.3)",
                                  color: "#fff",
                                  border: "1px solid rgba(255,255,255,0.3)",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                  padding: "2px 7px",
                                  borderRadius: 20,
                                }}
                              >
                                {acc.status}
                              </span>
                            </div>

                            <div className="mt-2">
                              <p
                                className="mb-0 text-white-50"
                                style={{ fontSize: "0.62rem", letterSpacing: "0.06em", textTransform: "uppercase" }}
                              >
                                Available Balance
                              </p>
                              <h5
                                className="fw-bold text-white mb-0"
                                style={{ fontSize: "1.2rem", letterSpacing: "-0.3px" }}
                              >
                                {acc.currency} {formatAmount(acc.balance)}
                              </h5>
                            </div>

                            <div
                              className="d-flex align-items-center gap-2 mt-2 pt-2"
                              style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
                            >
                              <span
                                className="text-white-50"
                                style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
                              >
                                Account No.
                              </span>
                              <span className="text-white fw-semibold user-select-all" style={{ fontSize: "0.8rem" }}>
                                {acc.accountNo}
                              </span>
                              {acc.bankName && (
                                <span
                                  className="ms-auto text-white-50 text-truncate"
                                  style={{ maxWidth: 120, fontSize: "0.7rem" }}
                                >
                                  {acc.bankName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}
          </OnlyFor>
        </>
      )}
    </>
  );
};

export default AccountsPage;
