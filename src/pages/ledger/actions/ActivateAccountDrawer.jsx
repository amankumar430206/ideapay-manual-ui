import Drawer from "../../../components/Drawer";
import { ActivateAccountForm } from "../../../components/accounts/ActivateAccountForm";

const ActionDrawer = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer title={"Activate Account"} onClose={onClose} noClose width={650}>
        <ActivateAccountForm data={data} onClose={onClose} />
      </Drawer>
    </>
  );
};

export default ActionDrawer;
