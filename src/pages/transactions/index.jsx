import React, { useState } from "react";
import { Search, X } from "react-feather";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { fetchManualTransactions } from "../../api/api-service";
import { PageContent } from "../../components/PageContent";
import { Section } from "../../components/Section";
import { Button, ButtonGroup } from "../../components/buttons/Button";
import { Data, Row, Table } from "../../components/table/table";
import { formatAmount, getCurrentDate } from "../../utils/utils";
import { CURRENCIES } from "../../consts/formValues";
import { DATE_FORMAT } from "../../consts/AppContants";
import AddTransactionDrawer from "../clients/actions/AddTransactionDrawer";
import { ROLES } from "../../consts/AppRoles";
import { OnlyFor } from "../../components/Roles";
import { ExportDownload } from "../../components/export/ExportDownload";
import { useSelector } from "react-redux";

const TYPE_OPTIONS = [
  { name: "All", value: "" },
  { name: "Credit", value: "CREDIT" },
  { name: "Debit", value: "DEBIT" },
];

const TransactionsPage = () => {
  const currentUser = useSelector((s) => s.auth.currentUser);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  const toYMD = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const getMonthStart = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  };

  const DATE_PRESETS = [
    {
      label: "7 Days",
      key: "7d",
      range: () => {
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - 6);
        return { from: toYMD(from), to: toYMD(to) };
      },
    },
    {
      label: "30 Days",
      key: "30d",
      range: () => {
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - 29);
        return { from: toYMD(from), to: toYMD(to) };
      },
    },
    {
      label: "This Month",
      key: "month",
      range: () => ({ from: getMonthStart(), to: getCurrentDate() }),
    },
    {
      label: "Quarter",
      key: "quarter",
      range: () => {
        const to = new Date();
        const from = new Date();
        from.setMonth(from.getMonth() - 3);
        return { from: toYMD(from), to: toYMD(to) };
      },
    },
    {
      label: "6 Months",
      key: "6m",
      range: () => {
        const to = new Date();
        const from = new Date();
        from.setMonth(from.getMonth() - 6);
        return { from: toYMD(from), to: toYMD(to) };
      },
    },
    {
      label: "This Year",
      key: "year",
      range: () => {
        const to = new Date();
        return { from: `${to.getFullYear()}-01-01`, to: toYMD(to) };
      },
    },
  ];

  const [typeFilter, setTypeFilter] = useState(TYPE_OPTIONS[0]);
  const [transactionId, setTransactionId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [dateFrom, setDateFrom] = useState(getMonthStart);
  const [dateTo, setDateTo] = useState(getCurrentDate);
  const [activePreset, setActivePreset] = useState("month");
  const [currencyFilter, setCurrencyFilter] = useState("");

  const applyPreset = (preset) => {
    const { from, to } = preset.range();
    setDateFrom(from);
    setDateTo(to);
    setActivePreset(preset.key);
  };
  const [page] = useState(1);
  const limit = 20;

  const buildPayload = () => {
    const q = {};
    if (typeFilter.value) q.type = typeFilter.value;
    if (currencyFilter) q.currency = currencyFilter;
    if (transactionId) q.transactionId = transactionId;
    if (dateFrom) q.dateFrom = dateFrom;
    if (dateTo) q.dateTo = dateTo;
    return { query: q, page, limit, populate: ["senderAccountId", "receiverAccountId"] };
  };

  const query = useQuery({
    queryKey: ["transactions", typeFilter.value, transactionId, dateFrom, dateTo, currencyFilter, page],
    queryFn: () => fetchManualTransactions(buildPayload()),
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setTransactionId(searchInput.trim());
  };

  const handleClearFilters = () => {
    setTypeFilter(TYPE_OPTIONS[0]);
    setTransactionId("");
    setSearchInput("");
    setDateFrom(getMonthStart());
    setDateTo(getCurrentDate());
    setActivePreset("month");
    setCurrencyFilter("");
  };

  const hasActiveFilters =
    typeFilter.value || transactionId || currencyFilter || dateFrom !== getMonthStart() || dateTo !== getCurrentDate();

  const openEdit = (item) => {
    setCurrentRecord({ transactionId: item._id, ...item });
    setIsAddTransactionOpen(true);
  };

  const pdfExportConfig = {
    excludeKeys: [
      "senderAccountId",
      "receiverAccountId",
      "isManualEntry",
      "__v",
      "payeeBankAddress",
      "beneficiaryBankAddress",
      "status",
    ],
  };

  return (
    <PageContent>
      {/* ── Header ── */}
      <Section>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <h3 className="fw-light mb-0">Transactions</h3>
            <p className="text-muted small mb-0">{query.data?.content?.length ?? 0} records</p>
          </div>
          <ButtonGroup>
            <OnlyFor roles={[ROLES.SUPER]}>
              <Button
                className="btn btn-primary"
                text="+ Add Transaction"
                onClick={() => {
                  setCurrentRecord(null);
                  setIsAddTransactionOpen(true);
                }}
              />
            </OnlyFor>

            <ExportDownload
              buttonVariant="secondary"
              label="Export Data"
              data={query.data?.content}
              filename={`transaction-report_${dateFrom}_${dateTo}`}
              pdfExportConfig={pdfExportConfig}
              meta={{
                accountName: currentUser?.firstName,
                accountId: currentUser?.userId,
                fromDate: dateFrom,
                toDate: dateTo,
                reportName: "Transaction Report",
              }}
            />
          </ButtonGroup>
        </div>
      </Section>

      {/* ── Filters ── */}
      <Section className="mt-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body py-3">
            <div className="row g-3 align-items-end">
              {/* Type pills */}
              <div className="col-12">
                <label className="form-label small text-muted mb-1">Type</label>
                <div className="d-flex gap-2">
                  {TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`btn btn-sm px-3 ${
                        opt.value === typeFilter.value
                          ? opt.value === "CREDIT"
                            ? "btn-success"
                            : opt.value === "DEBIT"
                              ? "btn-danger"
                              : "btn-primary"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => setTypeFilter(opt)}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction ID search */}
              <div className="col-sm-12 col-md-3">
                <label className="form-label small text-muted">Transaction ID</label>
                <form onSubmit={handleSearchSubmit}>
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. TXN-001"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button className="btn btn-light border" type="submit">
                      <Search size={13} />
                    </button>
                  </div>
                </form>
              </div>

              {/* Currency */}
              <div className="col-sm-12 col-md-2">
                <label className="form-label small text-muted">Currency</label>
                <select
                  className="form-select form-select-sm"
                  value={currencyFilter}
                  onChange={(e) => setCurrencyFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date presets + range */}
              <div className="col-sm-12 col-md-12">
                <label className="form-label small text-muted mb-1">Date Range</label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {DATE_PRESETS.map((preset) => (
                    <button
                      key={preset.key}
                      type="button"
                      className={`btn btn-sm px-3 ${
                        activePreset === preset.key ? "btn-dark" : "btn-outline-secondary"
                      }`}
                      onClick={() => applyPreset(preset)}
                    >
                      {preset.label}
                    </button>
                  ))}

                  <input
                    type="date"
                    className="form-control form-control-sm"
                    style={{ maxWidth: 160 }}
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      setActivePreset(null);
                    }}
                  />

                  <span className="text-muted small">-</span>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    style={{ maxWidth: 160 }}
                    value={dateTo}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      setActivePreset(null);
                    }}
                  />
                </div>

                <div className="d-flex gap-2 align-items-center"></div>
              </div>

              {/* Clear */}
              {hasActiveFilters && (
                <div className="col-auto">
                  <button
                    className="btn btn-sm btn-link text-danger text-decoration-none d-flex align-items-center gap-1"
                    onClick={handleClearFilters}
                  >
                    <X size={13} /> Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Table ── */}
      <Section className="mt-4">
        <Table
          loading={query.isLoading}
          cols={[
            "date",
            "transaction id",
            "type",
            "amount",
            "sender account",
            "receiver account",
            "payee",
            "beneficiary",
            "fee",
            "net amount",
            "description",
            "actions",
          ]}
          dataSize={query.data?.content?.length}
        >
          {query.data?.content?.map((item) => (
            <Row key={item._id}>
              {/* Date */}
              <Data>
                <span className="fw-semibold small">
                  {item.transactionDate ? format(new Date(item.transactionDate), DATE_FORMAT) : "—"}
                </span>
              </Data>

              {/* Transaction ID */}
              <Data>
                <span className="text-primary fw-semibold user-select-all small">
                  {item.transactionId || item._id || "—"}
                </span>
              </Data>

              {/* Type */}
              <Data>
                <span className={`badge rounded-pill px-3 py-1 ${item.type === "CREDIT" ? "bg-success" : "bg-danger"}`}>
                  {item.type}
                </span>
              </Data>

              {/* Amount */}
              <Data>
                <span className="fw-bold">{formatAmount(item.amount)}</span>
                <span className="text-muted small d-block">{item.currency}</span>
              </Data>

              {/* Sender Account */}
              <Data>
                {item.senderAccountId ? (
                  <>
                    <span className="text-dark fw-semibold user-select-all small d-block">
                      {item.senderAccountId.accountNo}
                    </span>
                    <span className="text-muted small d-block">{item.senderAccountId.accountName}</span>
                    <span className="badge bg-light text-secondary border mt-1" style={{ fontSize: "0.65rem" }}>
                      {item.senderAccountId.currency}
                    </span>
                  </>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </Data>

              {/* Receiver Account */}
              <Data>
                {item.receiverAccountId ? (
                  <>
                    <span className="text-dark fw-semibold user-select-all small d-block">
                      {item.receiverAccountId.accountNo}
                    </span>
                    <span className="text-muted small d-block">{item.receiverAccountId.accountName}</span>
                    <span className="badge bg-light text-secondary border mt-1" style={{ fontSize: "0.65rem" }}>
                      {item.receiverAccountId.currency}
                    </span>
                  </>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </Data>

              {/* Payee */}
              <Data>
                <span className="small d-block fw-semibold">{item.payeeName || "—"}</span>
                {item.payeeAccountNo && <span className="text-muted small user-select-all">{item.payeeAccountNo}</span>}
                {item.payeeBankName && <span className="text-muted small d-block">{item.payeeBankName}</span>}
              </Data>

              {/* Beneficiary */}
              <Data>
                <span className="small d-block fw-semibold">{item.beneficiaryName || "—"}</span>
                {item.beneficiaryAccountNo && (
                  <span className="text-muted small user-select-all">{item.beneficiaryAccountNo}</span>
                )}
                {item.beneficiaryBankName && (
                  <span className="text-muted small d-block">{item.beneficiaryBankName}</span>
                )}
                {item.beneficiaryCurrency && item.beneficiaryAmount != null && (
                  <span className="small text-secondary d-block">
                    {item.beneficiaryCurrency} {formatAmount(item.beneficiaryAmount)}
                  </span>
                )}
              </Data>

              {/* Fee */}
              <Data>
                {item.transactionFee != null ? (
                  <span className="small">{formatAmount(item.transactionFee)}</span>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </Data>

              {/* Net Amount */}
              <Data>
                {item.netAmount != null ? (
                  <span className={`small fw-semibold ${item.type === "CREDIT" ? "text-success" : "text-danger"}`}>
                    {formatAmount(item.netAmount)}
                  </span>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </Data>

              {/* Description */}
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

              {/* Actions */}
              <Data>
                <OnlyFor roles={[ROLES.SUPER]}>
                  <Button className="btn btn-outline-primary btn-sm px-3" text="Edit" onClick={() => openEdit(item)} />
                </OnlyFor>
              </Data>
            </Row>
          ))}
        </Table>
      </Section>

      {/* ── Drawer ── */}
      {isAddTransactionOpen && (
        <AddTransactionDrawer
          data={currentRecord}
          onClose={() => {
            setIsAddTransactionOpen(false);
            setCurrentRecord(null);
            query.refetch();
          }}
        />
      )}
    </PageContent>
  );
};

export default TransactionsPage;
