import React from "react";

export const Input = ({ id, label, readOnly = false, ...props }) => {
  return (
    <>
      {label && (
        <label for={id} className="form-label text-capitalize">
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        className="form-control"
        readOnly={readOnly}
        {...props}
      />
    </>
  );
};

export const InputReadOnly = ({ id, label, readOnly = false, ...props }) => {
  return (
    <>
      {label && (
        <label for={id} className="form-label text-capitalize">
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        className="form-control"
        readOnly={readOnly}
        disabled={readOnly}
        {...props}
      />
    </>
  );
};

export const InputDisplay = ({ id, label, readOnly = false, ...props }) => {
  return (
    <>
      {label && (
        <label for={id} className="form-label text-capitalize">
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        className="form-control bg-white text-dark"
        readOnly={readOnly}
        disabled={readOnly}
        {...props}
      />
    </>
  );
};

export const RadioDisplay = ({
  id,
  label,
  radioLabel,
  readOnly = false,
  ...props
}) => {
  return (
    <>
      {label && (
        <>
          <label for={id} className="form-label text-capitalize required">
            {label}
          </label>
          <br />
        </>
      )}
      <div class="form-check form-check-inline">
        <input
          id={id}
          type="radio"
          className="form-check-input"
          readOnly={readOnly}
          disabled={readOnly}
          {...props}
        />
        <label class="form-check-label" for={id}>
          {radioLabel}
        </label>
      </div>
    </>
  );
};

export default Input;
