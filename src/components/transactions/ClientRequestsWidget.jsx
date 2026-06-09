import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { fetchTransactionRequests } from "../../api/api-service";
import { formatAmount } from "../../utils/utils";
import { DATE_FORMAT } from "../../consts/AppContants";

const statusStyle = {
  PENDING: "bg-warning text-dark",
  APPROVED: "bg-success text-white",
  REJECTED: "bg-danger text-white",
};

export const ClientRequestsWidget = () => {
  const currentUser = useSelector((s) => s.auth.currentUser);

  const query = useQuery({
    queryKey: ["transaction-requests", currentUser?._id],
    queryFn: () =>
      fetchTransactionRequests({
        query: { requestedBy: currentUser?._id },
        populate: ["senderAccountId"],
        limit: 5,
      }),
    enabled: !!currentUser?._id,
  });

  if (!query.data?.content?.length && !query.isLoading) return null;

  return (
    <div className="card border-0 shadow-sm mt-4">
      <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
        <div>
          <h6 className="mb-0 fw-semibold">Pending Transaction Requests</h6>
          <p className="text-muted small mb-0">Being processed</p>
        </div>
        {query.data?.pagination?.total > 5 && (
          <span className="badge bg-warning text-dark">{query.data.pagination.total} total</span>
        )}
      </div>
      <div className="card-body p-0">
        {query.isLoading ? (
          <div className="p-3 text-muted small">Loading...</div>
        ) : (
          <div className="list-group list-group-flush">
            {query.data?.content?.map((item) => (
              <div key={item._id} className="list-group-item px-3 py-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="fw-semibold text-primary small user-select-all">{item.transactionId}</span>
                    <p className="mb-0 text-muted small">
                      {item.senderAccountId?.accountNo || "—"} &nbsp;·&nbsp;
                      {item.transactionDate ? format(new Date(item.transactionDate), DATE_FORMAT) : "—"}
                    </p>
                    {item.description && (
                      <p className="mb-0 text-muted small text-truncate" style={{ maxWidth: 260 }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="text-end">
                    <div className="fw-bold text-danger small">
                      -{formatAmount(item.amount)} <span className="text-muted fw-normal">{item.currency}</span>
                    </div>
                    <span className={`badge rounded-pill px-2 py-1 mt-1 ${statusStyle[item.status] || "bg-secondary"}`} style={{ fontSize: "0.65rem" }}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
