import { useQuery } from "@tanstack/react-query";
import Drawer from "../../components/Drawer";
import { formatAmount, getAmountWithCurrency } from "../../utils/utils";
import { fetchPoolAccounts } from "../../api/api-service";

export const PoolAccountSwitchDrawer = ({
  onClose,
  data = [],
  onSelect = () => null,
}) => {
  const accountsQuery = useQuery({
    queryKey: ["accounts", "pool"],
    queryFn: () =>
      fetchPoolAccounts({
        query: {},
      }),
  });

  return (
    <>
      <Drawer
        title={"Pool Accounts & Balances"}
        onClose={onClose}
        noClose
        width={600}
      >
        <h6>Pool Accounts</h6>
        <ul className="list-group">
          {accountsQuery?.data?.content?.map((account) => (
            <li
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-start p-3"
              onClick={() => onSelect(account)}
            >
              <div className="ms-2 me-auto">
                <h5 className="text-primary">{account?.accountNo}</h5>
                <p className="lead">{account?.accountName}</p>
                <h5 className="text-secondary">
                  Balance :{" "}
                  {getAmountWithCurrency(
                    formatAmount(account?.balance),
                    account?.currency
                  )}
                </h5>
              </div>
            </li>
          ))}
        </ul>
      </Drawer>
    </>
  );
};
