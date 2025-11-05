// UserLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

import { MainStudentNavbar } from "./StudentNavbar";

export const StudentLayout = () => {
  return (
    <>
      <MainStudentNavbar />
      <Outlet /> {/* renders the nested route component */}
    </>
  );
};
