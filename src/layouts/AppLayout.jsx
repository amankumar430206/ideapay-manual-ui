import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { SubNavbar } from "../components/SubNavbar";
import { AuthGuard } from "../components/AuthGuard";
import { SessionTimer } from "../components/SessionTimer";
import Footer from "../components/Footer";

export const AppLayout = () => {
  return (
    <>
      <AuthGuard>
        <Navbar />
        <SubNavbar />
        <div className="container py-3">
          <Outlet />
        </div>
        <Footer />
      </AuthGuard>
    </>
  );
};
