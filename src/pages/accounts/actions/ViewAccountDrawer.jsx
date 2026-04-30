import Drawer from "../../../components/Drawer";
import { ViewAccountDetail } from "../../../components/accounts/ViewAccountDetail";

const ViewAccountDrawer = ({ data, onClose }) => {
  return (
    <Drawer title="Account Details" onClose={onClose} width={520}>
      <ViewAccountDetail data={data} />
    </Drawer>
  );
};

export default ViewAccountDrawer;
