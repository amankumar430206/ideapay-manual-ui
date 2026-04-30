import React, { useEffect, useRef } from "react";
import { Spinner } from "./spinner";

const Drawer = ({
  loading,
  id,
  children,
  title,
  width = 450,
  onClose,
  noClose = false,
}) => {
  const drawerRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      drawerRef.current.className = `${drawerRef.current.className} show`;
    }, 0);
  }, []);

  const handleClose = () => {
    if (noClose) return;
    onClose();
  };

  return (
    <>
      <div
        ref={drawerRef}
        className="offcanvas offcanvas-end"
        data-bs-backdrop="false"
        tabIndex="-1"
        id={id}
        style={{ width: `${width}px` }}
      >
        <div class="offcanvas-header border-bottom border-light text-capitalize">
          <div className="d-flex align-items-center">
            <button
              type="button"
              class="btn-close text-reset me-3"
              data-bs-dismiss="offcanvas"
              onClick={onClose}
            ></button>
            <h5 class="offcanvas-title text-muted">
              {title || "Drawer Heading"}
            </h5>
          </div>
        </div>

        {loading ? (
          <div class="offcanvas-body">
            <Spinner text="Please Wait.." />
          </div>
        ) : (
          <div class="offcanvas-body">{children}</div>
        )}
      </div>
      <div class="offcanvas-backdrop show" onClick={handleClose}></div>
    </>
  );
};

export default Drawer;
