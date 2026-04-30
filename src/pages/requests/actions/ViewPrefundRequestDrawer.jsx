import Drawer from "../../../components/Drawer";

import { ViewPrefundRequest } from "../../../components/requests/ViewPrefundRequest";

export const ViewPrefundRequestDrawer = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer title={"View Request"} onClose={onClose} noClose width={600}>
        <ViewPrefundRequest data={data} onClose={onClose} />
      </Drawer>
    </>
  );
};
