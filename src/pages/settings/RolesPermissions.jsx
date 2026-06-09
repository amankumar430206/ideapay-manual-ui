import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { fetchRolePermissions, updateRolePermissions } from "../../api/api-service";
import { PageContent } from "../../components/PageContent";
import { Section } from "../../components/Section";
import { Button } from "../../components/buttons/Button";
import { ROLE_LIST, ROLE_META, ROLES, VISIBLE_ROLE_LIST } from "../../consts/AppRoles";
import {
  ACTION_LABELS,
  ALL_PERMISSION_IDS,
  DEFAULT_ROLE_PERMISSIONS,
  VISIBLE_PERMISSION_GROUPS,
  permissionId,
} from "../../consts/Permissions";

const idsToMap = (ids = []) => ids.reduce((m, id) => ({ ...m, [id]: true }), {});
const mapToIds = (map = {}) => Object.keys(map).filter((id) => map[id]);

const emptyState = () => ROLE_LIST.reduce((acc, role) => ({ ...acc, [role]: {} }), {});

const RolesPermissionsPage = () => {
  const [activeRole, setActiveRole] = useState(ROLES.SUPER);
  const [permissions, setPermissions] = useState(emptyState);

  const query = useQuery({
    queryKey: ["role-permissions"],
    queryFn: fetchRolePermissions,
  });

  // Sync server data into local editable state once it arrives.
  useEffect(() => {
    if (!query.data?.content) return;
    const next = emptyState();
    query.data.content.forEach(({ role, permissions: perms }) => {
      next[role] = idsToMap(perms);
    });
    setPermissions(next);
  }, [query.data]);

  const saveMutation = useMutation({
    mutationFn: updateRolePermissions,
    onSuccess: (res) => {
      toast(res.msg || "Permissions saved", { type: "success" });
      query.refetch();
    },
    onError: () => toast("Failed to save permissions", { type: "error" }),
  });

  const current = useMemo(() => permissions[activeRole] || {}, [permissions, activeRole]);
  const enabledCount = useMemo(
    () => ALL_PERMISSION_IDS.filter((id) => current[id]).length,
    [current]
  );
  const totalCount = ALL_PERMISSION_IDS.length;
  const allSelected = enabledCount === totalCount;

  // Generic helper: set a list of permission ids on/off for the active role.
  const setMany = (ids, value) =>
    setPermissions((prev) => {
      const next = { ...(prev[activeRole] || {}) };
      ids.forEach((id) => {
        if (value) next[id] = true;
        else delete next[id];
      });
      return { ...prev, [activeRole]: next };
    });

  const toggleOne = (id) => setMany([id], !current[id]);
  const toggleSelectAll = () => setMany(ALL_PERMISSION_IDS, !allSelected);

  const groupIds = (group) =>
    group.features.flatMap((f) => f.actions.map((a) => permissionId(group.key, f.key, a)));
  const featureIds = (groupKey, feature) =>
    feature.actions.map((a) => permissionId(groupKey, feature.key, a));

  const isEvery = (ids) => ids.length > 0 && ids.every((id) => current[id]);
  const isSome = (ids) => ids.some((id) => current[id]) && !isEvery(ids);

  const handleSave = () =>
    saveMutation.mutate({ role: activeRole, permissions: mapToIds(current) });

  // Apply the recommended default preset for the active role.
  const applyPreset = () =>
    setPermissions((prev) => ({
      ...prev,
      [activeRole]: idsToMap(DEFAULT_ROLE_PERMISSIONS[activeRole] || []),
    }));

  // Clear all permissions for the active role.
  const clearAll = () =>
    setPermissions((prev) => ({ ...prev, [activeRole]: {} }));

  return (
    <PageContent>
      <Section>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <h3 className="fw-light mb-0">Roles &amp; Permissions</h3>
            <p className="text-muted small mb-0">
              Control which features each role can access across the app.
            </p>
          </div>
          <Button
            className="btn btn-primary btn-sm px-3"
            text="+ Add Role"
            onClick={() => toast("Add role — coming soon", { type: "info" })}
          />
        </div>
      </Section>

      {/* Role selector */}
      <Section className="mt-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body py-3">
            <div className="d-flex flex-wrap gap-2">
              {VISIBLE_ROLE_LIST.map((role) => {
                const meta = ROLE_META[role];
                const isActive = role === activeRole;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setActiveRole(role)}
                    className={`btn btn-sm px-3 ${isActive ? "btn-primary" : "btn-light border"}`}
                  >
                    {meta?.label || role}
                  </button>
                );
              })}
            </div>
            <p className="text-muted small mb-0 mt-3">{ROLE_META[activeRole]?.description}</p>
          </div>
        </div>
      </Section>

      {/* Master select-all + counter */}
      <Section className="mt-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <span className="fw-semibold">
                Permissions for {ROLE_META[activeRole]?.label || activeRole}
              </span>
              <span className="text-muted small ms-2">
                {enabledCount} of {totalCount} enabled
              </span>
              {query.isLoading && (
                <span className="spinner-border spinner-border-sm text-secondary ms-2" role="status" />
              )}
            </div>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={applyPreset}
                title="Apply the recommended permissions for this role"
              >
                Apply Default Preset
              </button>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="select-all-permissions"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
                <label className="form-check-label small fw-semibold" htmlFor="select-all-permissions">
                  Select all
                </label>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Permission groups */}
      {VISIBLE_PERMISSION_GROUPS.map((group) => {
        const gIds = groupIds(group);
        const groupAll = isEvery(gIds);
        const groupSome = isSome(gIds);
        return (
          <Section key={group.key} className="mt-3">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                <div>
                  <span className="fw-semibold">{group.name}</span>
                  <span className="text-muted small d-block">{group.description}</span>
                </div>
                <div className="form-check mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`group-${group.key}`}
                    checked={groupAll}
                    ref={(el) => el && (el.indeterminate = groupSome)}
                    onChange={() => setMany(gIds, !groupAll)}
                  />
                  <label className="form-check-label small" htmlFor={`group-${group.key}`}>
                    Select all
                  </label>
                </div>
              </div>

              <div className="card-body p-0">
                {group.features.map((feature, idx) => {
                  const fIds = featureIds(group.key, feature);
                  const featureAll = isEvery(fIds);
                  return (
                    <div key={feature.key} className={`px-3 py-3 ${idx > 0 ? "border-top" : ""}`}>
                      <div className="row align-items-center g-2">
                        <div className="col-12 col-lg-4">
                          <div className="form-check mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`feature-${group.key}-${feature.key}`}
                              checked={featureAll}
                              ref={(el) => el && (el.indeterminate = isSome(fIds))}
                              onChange={() => setMany(fIds, !featureAll)}
                            />
                            <label
                              className="form-check-label fw-semibold"
                              htmlFor={`feature-${group.key}-${feature.key}`}
                            >
                              {feature.name}
                            </label>
                          </div>
                          <span className="text-muted small d-block ms-4">{feature.description}</span>
                        </div>

                        <div className="col-12 col-lg-8">
                          <div className="d-flex flex-wrap gap-3 justify-content-lg-end">
                            {feature.actions.map((action) => {
                              const id = permissionId(group.key, feature.key, action);
                              return (
                                <div
                                  key={id}
                                  className="form-check form-switch mb-0"
                                  style={{ minWidth: 90 }}
                                >
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id={id}
                                    checked={!!current[id]}
                                    onChange={() => toggleOne(id)}
                                  />
                                  <label className="form-check-label small" htmlFor={id}>
                                    {ACTION_LABELS[action]}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>
        );
      })}

      {/* Footer actions */}
      <Section className="mt-3 mb-5">
        <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
          <Button
            className="btn btn-link btn-sm text-danger text-decoration-none px-2"
            text="Clear all"
            disabled={saveMutation.isPending}
            onClick={clearAll}
          />
          <div className="d-flex gap-2">
            <Button
              className="btn btn-light border btn-sm px-3"
              text="Apply Default Preset"
              disabled={saveMutation.isPending}
              onClick={applyPreset}
            />
            <Button
              className="btn btn-light border btn-sm px-3"
              text="Reset"
              disabled={saveMutation.isPending}
              onClick={() => query.refetch()}
            />
            <Button
              className="btn btn-primary btn-sm px-4"
              text={`Save ${ROLE_META[activeRole]?.label || activeRole}`}
              loading={saveMutation.isPending}
              onClick={handleSave}
            />
          </div>
        </div>
      </Section>
    </PageContent>
  );
};

export default RolesPermissionsPage;
