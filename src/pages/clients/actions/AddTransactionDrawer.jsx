import Drawer from "../../../components/Drawer";
import { ManualTransactionForm } from "../../../components/transactions/ManualTransactionForm";

const AddTransactionDrawer = ({ data, onClose }) => {
  const isEdit = !!data?.transactionId;
  return (
    <Drawer
      title={isEdit ? "Edit Transaction" : "Add Transaction"}
      onClose={onClose}
      noClose
      width={600}
    >
      <ManualTransactionForm data={data} onClose={onClose} />
    </Drawer>
  );
};

export default AddTransactionDrawer;
