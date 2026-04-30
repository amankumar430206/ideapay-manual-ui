import Drawer from "../../components/Drawer";
import { TransferOutGoingWireForm } from "../../components/transfer/TransferOutGoingWireForm";

export const TransferOutWireDrawer = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer
        title={"Outgoing Wire Transfer"}
        onClose={onClose}
        noClose
        width={700}
      >
        <TransferOutGoingWireForm data={data} onClose={onClose} />
      </Drawer>
    </>
  );
};
