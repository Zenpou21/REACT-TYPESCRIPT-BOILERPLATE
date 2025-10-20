import { Outlet } from "react-router-dom";
import NetworkChecker from "../common/NetworkChecker";
import { useTheme } from "../../hooks/useThemeContext";
import { Sidebar } from "../common/Sidebar";
import Navbar from "../common/Navbar";
import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { AndroidNotification } from "../common/AndroidNotification";
// import InactivityHandler from "../common/InactivityHandler";

const Layout = () => {
  const { theme } = useTheme();
  const isWeb = Capacitor.getPlatform() === "web";

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const storedSidebarState = localStorage.getItem("isSidebarCollapsed");
    return storedSidebarState !== null ? JSON.parse(storedSidebarState) : true;
  });

  useEffect(() => {
    const storedSidebarState = localStorage.getItem("isSidebarCollapsed");
    if (storedSidebarState === null) {
      localStorage.setItem("isSidebarCollapsed", JSON.stringify(true));
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prevState: boolean) => {
      const newState = !prevState;
      localStorage.setItem("isSidebarCollapsed", JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div className={`${theme} relative flex h-screen overflow-hidden font-body`}>
      {!isWeb && <AndroidNotification />}
      <NetworkChecker />
      {/* <InactivityHandler /> */}
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className={`${!isWeb ? `mt-3` : `mt-0`} flex flex-col flex-1 w-full`}>
        <Navbar toggleSidebar={toggleSidebar} />
        <main
          className={`h-full relative overflow-y-auto py-5 mt-2 px-2.5 sm:px-8`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
