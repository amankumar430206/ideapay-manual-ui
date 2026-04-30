const COLORS = {
  primary: "primary",
  success: "success",
  danger: "danger",
  warning: "warning",
  info: "info",
  light: "light",
  dark: "dark",
  secondary: "secondary",
};

export const StatusBadge = ({ status, text, noOutline }) => {
  const STATUS_MAP = {
    text: (
      <Badge noOutline={noOutline} color={COLORS.light} text={text || "text"} />
    ),
    active: (
      <Badge
        noOutline={noOutline}
        color={COLORS.success}
        text={text || "active"}
      />
    ),
    inactive: (
      <Badge
        noOutline={noOutline}
        color={COLORS.warning}
        text={text || "inactive"}
      />
    ),
    completed: (
      <Badge
        noOutline={noOutline}
        color={COLORS.success}
        text={text || "completed"}
      />
    ),
    approved: (
      <Badge
        noOutline={noOutline}
        color={COLORS.success}
        text={text || "approved"}
      />
    ),
    info: (
      <Badge
        noOutline={noOutline}
        color={COLORS.info}
        text={text || "allocated"}
      />
    ),
    pending: (
      <Badge
        noOutline={noOutline}
        color={COLORS.warning}
        text={text || "pending"}
      />
    ),
    declined: (
      <Badge
        noOutline={noOutline}
        color={COLORS.danger}
        text={text || "declined"}
      />
    ),
    rejected: (
      <Badge
        noOutline={noOutline}
        color={COLORS.danger}
        text={text || "rejected"}
      />
    ),
    blocked: (
      <Badge
        noOutline={noOutline}
        color={COLORS.danger}
        text={text || "blocked"}
      />
    ),
  };
  return STATUS_MAP[status?.toLowerCase()];
};

const Badge = ({ color, text, noOutline }) => {
  return (
    <>
      <span
        className={`alert alert-${
          COLORS[color]
        } text-uppercase text-center p-1 px-2 m-0 ${
          noOutline && "border-0 bg-white fw-bold"
        }`}
        style={{
          minWidth: "120px",
          display: "inline-block",
          fontWeight: "500",
          fontSize: "12px",
        }}
      >
        <small>{text}</small>
      </span>
    </>
  );
};
