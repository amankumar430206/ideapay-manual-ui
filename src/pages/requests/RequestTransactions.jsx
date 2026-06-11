import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { fetchTransactionRequests, updateTransactionRequestStatus } from "../../api/api-service";
import { PageContent } from "../../components/PageContent";
import { Section } from "../../components/Section";
import { Button } from "../../components/buttons/Button";
import { Data, Row, Table } from "../../components/table/table";
import { StatusBadge } from "../../components/utils/StatusBadge";
import { OnlyFor } from "../../components/Roles";
import { ROLES } from "../../consts/AppRoles";
import { DATE_FORMAT } from "../../consts/AppContants";
import { formatAmount } from "../../utils/utils";

const RequestTransactionsPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const query = useQuery({
    queryKey: ["transaction-requests/admin", transactionId],
    queryFn: () =>
      fetchTransactionRequests({
        query: { transactionId },
        populate: ["senderAccountId", "requestedBy"],
      }),
  });

  const approveMutation = useMutation({
    mutationFn: updateTransactionRequestStatus,
    onSuccess: (res) => {
      toast(res.message || "Status updated", { type: "success" });
      query.refetch();
    },
    onError: () => toast("Failed to update status", { type: "error" }),
  });

  const handleAction = (id, status) => {
    approveMutation.mutate({ transactionId: id, status: status.toLowerCase() });
  };

  // Only the row + action actually clicked should show the loading spinner.
  const isActing = (id, status) =>
    approveMutation.isPending &&
    approveMutation.variables?.transactionId === id &&
    approveMutation.variables?.status === status;

  return (
    <PageContent>
      <Section>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <h3 className="fw-light mb-0">Transaction Requests</h3>
            <p className="text-muted small mb-0">
              {query.data?.content?.length ?? 0} pending requests from clients
            </p>
          </div>
        </div>
      </Section>

      <Section className="mt-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body py-3">
            <form
              className="d-flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setTransactionId(searchInput.trim());
              }}
            >
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search by Transaction ID..."
                style={{ maxWidth: 260 }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button className="btn btn-sm btn-light border" type="submit">
                Search
              </button>
              {transactionId && (
                <button
                  className="btn btn-sm btn-link text-danger text-decoration-none"
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setTransactionId("");
                  }}
                >
                  Clear
                </button>
              )}
            </form>
          </div>
        </div>
      </Section>

      <Section className="mt-4">
        <Table
          loading={query.isLoading}
          cols={["date", "transaction id", "client", "account", "amount", "payee", "description", "status", "actions"]}
          dataSize={query.data?.content?.length}
        >
          {query.data?.content?.map((item) => (
            <Row key={item._id}>
              <Data>
                <span className="small fw-semibold">
                  {item.transactionDate ? format(new Date(item.transactionDate), DATE_FORMAT) : "—"}
                </span>
              </Data>

              <Data>
                <span className="text-primary fw-semibold user-select-all small">{item.transactionId || "—"}</span>
              </Data>

              <Data>
                {item.requestedBy ? (
                  <>
                    <span className="small fw-semibold d-block">
                      {item.requestedBy.firstName} {item.requestedBy.lastName}
                    </span>
                    <span className="text-muted small">{item.requestedBy.email}</span>
                  </>
                ) : (
                  <span className="text-muted">—</span>
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
                <span className="fw-bold text-danger small">
                  {formatAmount(item.amount)}
                </span>
                <span className="text-muted small d-block">{item.currency}</span>
              </Data>

              <Data>
                <span className="small fw-semibold">{item.payeeName || "—"}</span>
                {item.payeeBankName && <span className="text-muted small d-block">{item.payeeBankName}</span>}
              </Data>

              <Data>
                <span
                  className="text-muted small"
                  style={{ maxWidth: 160, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  title={item.description}
                >
                  {item.description || "—"}
                </span>
              </Data>

              <Data>
                <StatusBadge status={item.status?.toLowerCase()} />
              </Data>

              <Data>
                <OnlyFor roles={[ROLES.SUPER, ROLES.ADMIN]}>
                  <div className="d-flex gap-2">
                    <Button
                      className="btn btn-success btn-sm px-3"
                      text="Approve"
                      loading={isActing(item._id, "approved")}
                      disabled={approveMutation.isPending}
                      onClick={() => handleAction(item._id, "approved")}
                    />
                    <Button
                      className="btn btn-outline-danger btn-sm px-3"
                      text="Reject"
                      loading={isActing(item._id, "rejected")}
                      disabled={approveMutation.isPending}
                      onClick={() => handleAction(item._id, "rejected")}
                    />
                  </div>
                </OnlyFor>
              </Data>
            </Row>
          ))}
        </Table>
      </Section>
    </PageContent>
  );
};

export default RequestTransactionsPage;
