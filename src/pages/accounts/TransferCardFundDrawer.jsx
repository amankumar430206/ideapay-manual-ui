import Drawer from "../../components/Drawer";
import { TransferCardFundForm } from "../../components/transfer/TransferCardFundForm";

export const TransferCardFundDrawer = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer title={"Transfer Card Fund"} onClose={onClose} noClose>
        <TransferCardFundForm data={data} onClose={onClose} />
      </Drawer>
    </>
  );
};
