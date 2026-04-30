import Drawer from "../../components/Drawer";
import { ViewTransaction } from "../../components/accounts/ViewTransaction";

export const ViewTransactionDrawer = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer
        title={"Transaction Details"}
        onClose={onClose}
        width={700}
        noClose
      >
        <ViewTransaction />
      </Drawer>
    </>
  );
};
