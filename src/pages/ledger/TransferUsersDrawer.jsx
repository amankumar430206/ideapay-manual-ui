import Drawer from "../../components/Drawer";
import { TransferUsersForm } from "../../components/transfer/TransferUsersForm";

export const TransferUsersDrawer = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer title={"Transfer Between Users"} onClose={onClose} noClose>
        <TransferUsersForm data={data} onClose={onClose} />
      </Drawer>
    </>
  );
};
