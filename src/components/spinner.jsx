import React from "react";

export const Spinner = ({ text }) => {
  return (
    <div
      className="d-flex align-items-center justify-content-center flex-column"
      style={{ height: "100vh" }}
    >
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-secondary text-capitalize mt-3">{text}</p>
    </div>
  );
};
