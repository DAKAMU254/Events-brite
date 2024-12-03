import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <Navbar />
      <div style={{ "min-height": "80vh" }}>
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default Layout;
