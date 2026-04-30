import Drawer from "../../../components/Drawer";

import { ApprovePrefundRequest } from "../../../components/requests/ApprovePrefundRequest";

export const ApprovePrefundRequestDrawer = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer
        title={"Approve Prefund Request"}
        onClose={onClose}
        noClose
        width={600}
      >
        <ApprovePrefundRequest data={data} onClose={onClose} />
      </Drawer>
    </>
  );
};
