import Drawer from "../../components/Drawer";
import { TransferIngoingWireForm } from "../../components/transfer/TransferIngoingForm";

export const TransferInWireDrawer = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer title={"Incoming Wire Transfer"} onClose={onClose} noClose>
        <TransferIngoingWireForm data={data} onClose={onClose} />
      </Drawer>
    </>
  );
};
