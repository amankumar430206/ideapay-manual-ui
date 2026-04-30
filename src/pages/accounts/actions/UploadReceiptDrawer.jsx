import Drawer from "../../../components/Drawer";
import { UploadReceiptForm } from "../../../components/accounts/UploadReceiptForm";

const ActionDrawer = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer title={"Upload Receipt"} onClose={onClose} noClose width={650}>
        <UploadReceiptForm data={data} onClose={onClose} />
      </Drawer>
    </>
  );
};

export default ActionDrawer;
