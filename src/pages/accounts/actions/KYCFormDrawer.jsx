import Drawer from "../../../components/Drawer";
import KYCUpdateForm from "../../../components/users/KYCUpdateForm";

const ActionDrawer = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer title={"KYC Verification"} onClose={onClose} noClose width={800}>
        <KYCUpdateForm data={data} onClose={onClose} />
      </Drawer>
    </>
  );
};

export default ActionDrawer;
