import Drawer from "../../../components/Drawer";

import { ViewCardRequest } from "../../../components/requests/ViewCardRequest";

export const ViewCardRequestDrawer = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer title={"View Request"} onClose={onClose} noClose width={700}>
        <ViewCardRequest data={data} onClose={onClose} />
      </Drawer>
    </>
  );
};
