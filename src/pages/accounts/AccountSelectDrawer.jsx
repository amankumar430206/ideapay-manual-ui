import Drawer from "../../components/Drawer";
import { formatAmount, getAmountWithCurrency } from "../../utils/utils";

export const AccountSwitchDrawer = ({
  onClose,
  data = [],
  onSelect = () => null,
}) => {
  return (
    <>
      <Drawer
        title={"Accounts & Balances"}
        onClose={onClose}
        noClose
        width={600}
      >
        <h6>Select Account</h6>
        <p>Account(s)</p>
        <ul className="list-group">
          {data?.map((account) => (
            <li
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-start p-3"
              onClick={() => onSelect(account)}
            >
              <div className="ms-2 me-auto">
                <h5 className="text-primary">{account?.accountNo}</h5>
                <p className="lead">{account?.accountName}</p>
                <h5 className="text-secondary">
                  {getAmountWithCurrency(
                    formatAmount(account?.balance),
                    account?.currency
                  )}
                </h5>
              </div>
              <span className="badge text-bg-primary rounded-pill">
                {account?.active ? "Active" : "Inactive"}
              </span>
            </li>
          ))}
        </ul>
      </Drawer>
    </>
  );
};
