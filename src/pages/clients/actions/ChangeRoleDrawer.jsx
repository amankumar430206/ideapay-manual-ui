import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Drawer from "../../../components/Drawer";
import { Button, ButtonGroup } from "../../../components/buttons/Button";
import { UpdateUserRole } from "../../../api/api-service";
import { ROLE_META, VISIBLE_ROLE_LIST } from "../../../consts/AppRoles";

const ChangeRoleDrawer = ({ data, onClose }) => {
  const [role, setRole] = useState(data?.role || "");

  const mutation = useMutation({
    mutationFn: UpdateUserRole,
    onSuccess: (res) => {
      toast(res.msg || "Role updated", { type: "success" });
      onClose(true);
    },
    onError: () => {},
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role) return toast("Select a role", { type: "error" });
    if (role === data?.role) return toast("Role unchanged", { type: "info" });
    mutation.mutate({ userId: data?._id, role });
  };

  return (
    <Drawer title="Change User Role" onClose={() => onClose(false)} noClose width={460}>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={mutation.isPending}>
          <div className="mb-3">
            <span className="text-muted small d-block">User</span>
            <span className="fw-semibold">
              {data?.firstName} {data?.lastName}
            </span>
            <span className="text-muted small d-block">{data?.email}</span>
          </div>

          <div className="mb-2">
            <span className="text-muted small">Current role: </span>
            <span className="badge bg-secondary-subtle text-secondary border">
              {ROLE_META[data?.role]?.label || data?.role || "—"}
            </span>
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="form-label required">
              New Role
            </label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select role</option>
              {VISIBLE_ROLE_LIST.map((r) => (
                <option key={r} value={r}>
                  {ROLE_META[r]?.label || r}
                </option>
              ))}
            </select>
            {ROLE_META[role]?.description && (
              <div className="form-text">{ROLE_META[role].description}</div>
            )}
          </div>

          <ButtonGroup>
            <Button
              loading={mutation.isPending}
              className="btn btn-primary"
              text="Update Role"
              type="submit"
            />
            <Button className="btn btn-light" text="Cancel" type="button" onClick={() => onClose(false)} />
          </ButtonGroup>
        </fieldset>
      </form>
    </Drawer>
  );
};

export default ChangeRoleDrawer;
