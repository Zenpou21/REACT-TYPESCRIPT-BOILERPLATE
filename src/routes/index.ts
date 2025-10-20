import { lazy } from "react";


const coreRoutes = [
  {
    path: "/",
    title: "Dashboard",
    component: lazy(() => import("../pages/Dashboard/Dashboard")),
    isAllowed: true,
  },
  {
    path: "/login",
    title: "Login",
    component: lazy(() => import("../pages/Auth/Login")),
    isAllowed: true,
  },
  {
    path: "/dashboard",
    title: "Dashboard",
    component: lazy(() => import("../pages/Dashboard/Dashboard")),
    isAllowed: true,
  },
  {
    path: "/sample-table",
    title: "Warehouses",
    component: lazy(() => import("../pages/Warehouses/WarehousesDashboard")),
    isAllowed: true,
  },
     {
    path: "/settings",
    title: "Settings",
    component: lazy(() => import("../pages/Settings/SettingsDashboard")),
    isAllowed: true,
  },

];

const routes = [...coreRoutes];

if (typeof window !== 'undefined') {
  (window as any).process = {
    env: {
      NODE_ENV: 'production'
    },
    stdout: {},
    stderr: {},
    stdin: {},
    argv: [],
  };
}

export default routes;
