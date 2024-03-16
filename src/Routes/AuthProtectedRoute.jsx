import AppBar from "../Pages/AppBar/AppBar";
import Sidebar from "../Pages/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const AuthProtectedRoute = () => {
  const [openSideBar, setOpenSideBar] = useState(false);

  return (
    <div className="flex gap-1 h-screen">
      <Sidebar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <AppBar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />

        <Outlet />
      </main>
    </div>
  );
};

export default AuthProtectedRoute;
