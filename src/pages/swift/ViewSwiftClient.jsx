import Drawer from "../../components/Drawer";
import ViewSwifUser from "../../components/users/ViewSwiftUser";

const DrawerAction = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer title={`View Details`} onClose={onClose} noClose width={700}>
        <ViewSwifUser id={data?._id} data={data} onClose={onClose} />
      </Drawer>
    </>
  );
};

export default DrawerAction;
