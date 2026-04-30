import Drawer from "../../../components/Drawer";
import RegisterForm from "../../../components/users/AddClientForm";
import ViewUser from "../../../components/users/ViewUser";

const DrawerAction = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer title={`View Details`} onClose={onClose} noClose width={700}>
        <ViewUser id={data?._id} data={data} onClose={onClose} />
      </Drawer>
    </>
  );
};

export default DrawerAction;
