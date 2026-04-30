import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

export const BlankLayout = () => {
  return (
    <>
      <div className="container">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
