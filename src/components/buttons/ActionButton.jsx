import React from "react";
import "./button.scss";

const Button = ({ ref, text, loading, children, ...props }) => {
  return (
    <button ref={ref} {...props}>
      {text}
      {loading ? <ButtonSpinner /> : null}
    </button>
  );
};

export const ButtonSpinner = () => {
  return (
    <span
      className="spinner-border spinner-border-sm ms-2"
      role="status"
      aria-hidden="true"
    ></span>
  );
};

export default Button;
