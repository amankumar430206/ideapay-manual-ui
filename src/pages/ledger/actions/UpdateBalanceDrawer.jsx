import Drawer from "../../../components/Drawer";
import { AccountBalanceEditForm } from "../../../components/accounts/AccountBalance";

const ActionDrawer = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer
        title={"Update Account Balance"}
        onClose={onClose}
        noClose
        width={500}
      >
        <AccountBalanceEditForm data={data} onClose={onClose} />
      </Drawer>
    </>
  );
};

export default ActionDrawer;
