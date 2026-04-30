import React from "react";
import Skeleton from "react-loading-skeleton";

export const Input = ({
  id,
  label,
  register = null,
  error = null,
  className,
  required,
  ...props
}) => {
  return (
    <>
      {label && (
        <label
          htmlFor={id}
          className={`form-label text-capitalize ${required && "required"}`}
        >
          {label}
        </label>
      )}
      <div className="input-group">
        <input
          id={id}
          type="text"
          className={`form-control ${error && "is-invalid"}`}
          register={register}
          // {...props}
        />
        <div className="invalid-feedback">{error && error.message}</div>
      </div>
    </>
  );
};

export const Select = ({
  id,
  label,
  register = null,
  error = null,
  className,
  required,
  children,
  ...props
}) => {
  return (
    <>
      {label && (
        <label
          htmlFor={id}
          className={`form-label text-capitalize ${required && "required"}`}
        >
          {label}
        </label>
      )}
      <div className="form-group">
        <select
          id={id}
          type="text"
          className={`form-select ${error && "is-invalid"}`}
          register={register}
          {...props}
        >
          {children}
        </select>
        <div className="invalid-feedback">{error && error?.message}</div>
      </div>
    </>
  );
};

export const Textarea = ({
  id,
  label,
  validationSchema,
  register,
  rows = 3,
  ...props
}) => {
  return (
    <>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className="form-control"
        rows={rows}
        {...props}
      ></textarea>
    </>
  );
};
