import Drawer from "../../../components/Drawer";
import RegisterForm from "../../../components/users/AddClientForm";

const DrawerAction = ({ onClose, data = {} }) => {
  return (
    <>
      <Drawer title={"Add Client"} onClose={onClose} noClose width={700}>
        <RegisterForm data={data} onClose={onClose} />
      </Drawer>
    </>
  );
};

export default DrawerAction;
