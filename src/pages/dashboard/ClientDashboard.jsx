import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchAccountStats,
  fetchTransactionRequests,
  fetchUserAccounts,
  updateTransactionRequestStatus,
} from "../../api/api-service";
import { PageContent } from "../../components/PageContent";
import { Section } from "../../components/Section";
import { Button } from "../../components/buttons/Button";
import { StatsCard } from "../../components/cards/statsCard";
import { Data, Row, Table } from "../../components/table/table";
import { DATE_FORMAT } from "../../consts/AppContants";
import { ROLES } from "../../consts/AppRoles";
import { formatAmount } from "../../utils/utils";
import RequestTransactionDrawer from "../accounts/actions/RequestTransactionDrawer";

const ClientDashboard = () => {
  const currentUser = useSelector((s) => s.auth.currentUser);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  // Staff (admin / super) see ALL pending requests and can approve/reject,
  // just like the dedicated Transaction Requests page. Clients see their own.
  const isStaff = currentUser?.role === ROLES.SUPER || currentUser?.role === ROLES.ADMIN;

  const statsQuery = useQuery({
    queryKey: ["accounts/stats", currentUser?._id],
    queryFn: () => fetchAccountStats({ user: currentUser?._id }),
  });

  const accountsQuery = useQuery({
    queryKey: ["accounts/user", currentUser?._id],
    queryFn: () => fetchUserAccounts({ id: currentUser?._id }),
    enabled: !!currentUser?._id,
  });

  const requestsQuery = useQuery({
    queryKey: ["transaction-requests/dashboard", currentUser?._id, isStaff],
    queryFn: () =>
      fetchTransactionRequests({
        query: isStaff ? { status: "pending" } : { requestedBy: currentUser?._id },
        populate: ["senderAccountId", "requestedBy"],
        limit: 50,
      }),
    enabled: !!currentUser?._id,
  });

  const statusMutation = useMutation({
    mutationFn: updateTransactionRequestStatus,
    onSuccess: (res) => {
      toast(res.message || "Request updated", { type: "success" });
      requestsQuery.refetch();
    },
    onError: () => toast("Failed to update request", { type: "error" }),
  });

  const handleRequestAction = (id, status) => statusMutation.mutate({ transactionId: id, status });

  // Only the row + action actually clicked should show the loading spinner.
  const isActing = (id, status) =>
    statusMutation.isPending &&
    statusMutation.variables?.transactionId === id &&
    statusMutation.variables?.status === status;

  const stats = statsQuery.data?.content;
  const accounts = accountsQuery.data?.content || [];
  const requests = requestsQuery.data?.content || [];

  const pendingCount = requests.length;
  const totalPendingAmount = requests.reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <PageContent>
      {/* Header */}
      <Section>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <h3 className="fw-light mb-0">Welcome, {currentUser?.firstName}</h3>
          </div>
          <Button className="btn btn-primary" text={"+ Payment Request"} onClick={() => setIsRequestOpen(true)} />
        </div>
      </Section>

      {/* Stats */}
      <Section className="mt-4">
        <div className="row gy-3">
          <div className="col-sm-12 col-md-6 col-lg-3">
            <StatsCard text="Total Accounts" value={stats?.totalAccounts ?? "—"} loading={statsQuery.isLoading} />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-3">
            <StatsCard
              text="Active Accounts"
              value={stats?.totalActiveAccounts ?? "—"}
              loading={statsQuery.isLoading}
            />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-3">
            <StatsCard text="Pending Requests" value={requestsQuery.isLoading ? "—" : pendingCount} />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-3">
            <StatsCard
              text="Total Pending Amount"
              value={requestsQuery.isLoading ? "—" : formatAmount(totalPendingAmount)}
            />
          </div>
        </div>
      </Section>

      {/* Account balances */}
      {accounts.length > 0 && (
        <Section className="mt-4">
          <h6 className="fw-semibold mb-3">Account Balances</h6>
          <div className="row gy-3">
            {accounts.map((acc, i) => {
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
                      {/* Top row */}
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="mb-0 text-white-50 text-uppercase" style={{ letterSpacing: "0.08em", fontSize: "0.62rem" }}>
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

                      {/* Balance */}
                      <div className="mt-2">
                        <p className="mb-0 text-white-50" style={{ fontSize: "0.62rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          Available Balance
                        </p>
                        <h5 className="fw-bold text-white mb-0" style={{ fontSize: "1.2rem", letterSpacing: "-0.3px" }}>
                          {acc.currency} {formatAmount(acc.balance)}
                        </h5>
                      </div>

                      {/* Bottom row */}
                      <div
                        className="d-flex align-items-center gap-2 mt-2 pt-2"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
                      >
                        <span className="text-white-50" style={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                          Account No.
                        </span>
                        <span className="text-white fw-semibold user-select-all" style={{ fontSize: "0.75rem" }}>
                          {acc.accountNo}
                        </span>
                        {acc.bankName && (
                          <span className="ms-auto text-white-50 text-truncate" style={{ maxWidth: 120, fontSize: "0.62rem" }}>
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

      {/* Transaction Requests */}
      <Section className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h6 className="fw-semibold mb-0">Transaction Requests</h6>
            <p className="text-muted small mb-0">
              {isStaff ? "Debit requests pending approval" : "Debit requests being processed"}
            </p>
          </div>
          {pendingCount > 0 && (
            <span className="badge bg-warning text-dark px-3 py-2">
              {pendingCount} {isStaff ? "pending" : "processing"}
            </span>
          )}
        </div>

        <Table
          loading={requestsQuery.isLoading}
          cols={[
            "date",
            "transaction id",
            "account",
            "amount",
            "fee",
            "net",
            "payee",
            "description",
            ...(isStaff ? ["actions"] : []),
          ]}
          dataSize={requests.length}
        >
          {requests.map((item) => (
            <Row key={item._id}>
              <Data>
                <span className="small fw-semibold">
                  {item.transactionDate ? format(new Date(item.transactionDate), DATE_FORMAT) : "—"}
                </span>
              </Data>

              <Data>
                <span className="text-primary fw-semibold user-select-all small d-block">
                  {item.transactionId || "—"}
                </span>
                {isStaff && item.requestedBy && (
                  <span className="text-muted small">
                    by {item.requestedBy.firstName} {item.requestedBy.lastName}
                  </span>
                )}
              </Data>

              <Data>
                {item.senderAccountId ? (
                  <>
                    <span className="small fw-semibold d-block user-select-all">{item.senderAccountId.accountNo}</span>
                    <span className="text-muted small">{item.senderAccountId.accountName}</span>
                  </>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </Data>

              <Data>
                <span className="fw-bold text-danger small">{formatAmount(item.amount)}</span>
                <span className="text-muted small d-block">{item.currency}</span>
              </Data>

              <Data>
                <span className="small">{item.transactionFee ? formatAmount(item.transactionFee) : "—"}</span>
              </Data>

              <Data>
                <span className="small fw-semibold text-danger">
                  {item.netAmount != null ? formatAmount(item.netAmount) : "—"}
                </span>
              </Data>

              <Data>
                <span className="small fw-semibold">{item.payeeName || "—"}</span>
                {item.payeeBankName && <span className="text-muted small d-block">{item.payeeBankName}</span>}
              </Data>

              <Data>
                <span
                  className="text-muted small"
                  style={{
                    maxWidth: 160,
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={item.description}
                >
                  {item.description || "—"}
                </span>
              </Data>

              {isStaff && (
                <Data>
                  <div className="d-flex gap-2">
                    <Button
                      className="btn btn-success btn-sm px-3"
                      text="Approve"
                      loading={isActing(item._id, "approved")}
                      disabled={statusMutation.isPending}
                      onClick={() => handleRequestAction(item._id, "approved")}
                    />
                    <Button
                      className="btn btn-outline-danger btn-sm px-3"
                      text="Reject"
                      loading={isActing(item._id, "rejected")}
                      disabled={statusMutation.isPending}
                      onClick={() => handleRequestAction(item._id, "rejected")}
                    />
                  </div>
                </Data>
              )}
            </Row>
          ))}
        </Table>
      </Section>

      {isRequestOpen && (
        <RequestTransactionDrawer
          onClose={() => {
            setIsRequestOpen(false);
            requestsQuery.refetch();
          }}
        />
      )}
    </PageContent>
  );
};

export default ClientDashboard;
