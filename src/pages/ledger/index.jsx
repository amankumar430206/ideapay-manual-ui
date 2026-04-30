import React, { useState } from "react";
import { Search } from "react-feather";
import { PageContent } from "../../components/PageContent";
import { Section } from "../../components/Section";
import { Button } from "../../components/buttons/Button";
import { Data, Row, Table } from "../../components/table/table";
import { formatAmount, getFormValues } from "../../utils/utils";
// actions
import { useSelector } from "react-redux";
import { StatusBadge } from "../../components/utils/StatusBadge";
import { ROLES } from "../../consts/AppRoles";
import { TRANSFER_TYPE } from "../../consts/formValues";
import { useTransactions } from "../../hooks/useTransactions";

export const AccountsPage = () => {
  const currentUser = useSelector((s) => s.auth.currentUser);
  const [searchQuery, setSearchQuery] = useState("");

  const query = useTransactions({
    query: {
      type: TRANSFER_TYPE.ACCOUNTS,
      transactionId: searchQuery,
      transactionBy: currentUser?.role === ROLES.USER ? currentUser?._id : "",
    },
    populate: "senderAccountId receiverAccountId transactionBy",
  });

  const handleSearch = (e) => {
    const formValues = getFormValues(e);
    setSearchQuery(formValues.search);
  };

  return (
    <PageContent>
      <Section>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h3 className="fw-light">Ledger</h3>
        </div>
      </Section>

      {/* Search Section */}
      <Section className="mt-4">
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="d-flex">
              <div className="w-100">
                <form onSubmit={handleSearch}>
                  <label className="form-label">Search Transactions</label>
                  <div className="input-group">
                    <input
                      type="search"
                      name="search"
                      className="form-control"
                      placeholder="RBTXXXXXX"
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
          loading={false}
          cols={[
            "status",
            "transaction id",
            "transaction by",
            "sender account no.",
            "receiver account no.",
            "amount",
            "currency",
            "description",
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
                  <span className="text-primary fw-semibold user-select-all">
                    {item?.transactionId}
                  </span>
                </Data>
                <Data>
                  {`${item?.transactionBy?.firstName || "NA"} ${
                    item?.transactionBy?.lastName || ""
                  }`}
                </Data>
                <Data>{item?.senderAccountId?.accountNo}</Data>
                <Data>{item?.receiverAccountId?.accountNo}</Data>
                <Data>
                  <span className="text-secondary fw-semibold user-select-all">
                    {formatAmount(item?.amount)}
                  </span>
                </Data>
                <Data>{item?.currency}</Data>
                <Data>{item?.description}</Data>
              </Row>
            </>
          ))}
          {/* show empty list */}
        </Table>
      </Section>
    </PageContent>
  );
};

export default AccountsPage;
