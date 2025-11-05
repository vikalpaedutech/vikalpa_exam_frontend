// UserLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

import { MainUserNavbar } from "./UserNavBar";

export const UserLayout = () => {
  return (
    <>
      <MainUserNavbar />
      <Outlet /> {/* renders the nested route component */}
    </>
  );
};
