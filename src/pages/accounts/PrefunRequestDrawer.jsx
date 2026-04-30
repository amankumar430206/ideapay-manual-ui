import Drawer from "../../components/Drawer";
import { PrefundRequestForm } from "../../components/accounts/PrefundRequestForm";

export const PrefundRequestDrawer = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer
        title={"Account Prefund Request"}
        onClose={onClose}
        noClose
        width={600}
      >
        <PrefundRequestForm data={data} onClose={onClose} />
      </Drawer>
    </>
  );
};
