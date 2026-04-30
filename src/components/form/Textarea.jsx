import React from "react";

const Textarea = ({ id, label, rows = 3, ...props }) => {
  return (
    <>
      {label && (
        <label for={id} class="form-label">
          {label}
        </label>
      )}
      <textarea id={id} class="form-control" rows={rows} {...props}></textarea>
    </>
  );
};

export default Textarea;
