import React from "react";
import "./button.scss";

export const Button = ({
  ref,
  text,
  loading,
  children,
  disabled,
  icon,
  show = true,
  ...props
}) => {
  return (
    <>
      {show && (
        <button ref={ref} {...props} disabled={loading || disabled}>
          {loading ? <ButtonSpinner /> : null}
          {text || children}
        </button>
      )}
    </>
  );
};

export const ButtonSpinner = () => {
  return (
    <>
      <span
        className="spinner-border spinner-border-sm me-2"
        role="status"
        aria-hidden="true"
      ></span>
    </>
  );
};

export const ButtonGroup = ({ children, props }) => {
  return (
    <>
      <div className="button-group" {...props}>
        {children}
      </div>
    </>
  );
};
