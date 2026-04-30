import Drawer from "../../components/Drawer";
import { TransferAccountsForm } from "../../components/transfer/TransferAccountsForm";

export const TransferAccountsDrawer = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer
        title={"Transfer Between Accounts"}
        onClose={onClose}
        noClose
        width={600}
      >
        <TransferAccountsForm data={data} onClose={onClose} />
      </Drawer>
    </>
  );
};
