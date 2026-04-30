import Drawer from "../../../components/Drawer";
import { AddAccountForm } from "../../../components/accounts/AddAccountForm";

const ActionDrawer = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer title={"Add New Account"} onClose={onClose} noClose width={500}>
        <AddAccountForm data={data} onClose={onClose} />
      </Drawer>
    </>
  );
};

export default ActionDrawer;
