import Drawer from "../../../components/Drawer";
import { ClientTransactionRequestForm } from "../../../components/transactions/ClientTransactionRequestForm";

const RequestTransactionDrawer = ({ onClose }) => {
  return (
    <Drawer title="Request Transaction" onClose={onClose} noClose width={600}>
      <ClientTransactionRequestForm onClose={onClose} />
    </Drawer>
  );
};

export default RequestTransactionDrawer;
