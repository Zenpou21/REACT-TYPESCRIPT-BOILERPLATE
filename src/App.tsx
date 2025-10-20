import { Route, Routes } from "react-router-dom";
import "./index.css";
import routes from "./routes";
import { lazy, Suspense } from "react";
import Error401 from "./pages/Errors/Error401";
import Error404 from "./pages/Errors/Error404";
import { LoginRoute } from "./hooks/useLoginRoute";
import Login from "./pages/Auth/Login";
import { ToastProvider } from "@heroui/toast";
import { PrivateRoute } from "./hooks/usePrivateRoute";
const Layout = lazy(() => import("./components/layout/Layout"));

function App() {
  return (
    <>
      <ToastProvider
        placement="top-right"
        toastProps={{
          classNames: {
            base: "!font-body mt-8 md:mt-5 text-white !rounded-md",
            description: "text-xs text-white",
          },
          variant: "solid",
        }}
      />
      <Routes>
        <Route
          path="/login"
          element={
            <LoginRoute>
              <Login />
            </LoginRoute>
          }
        />
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {routes.map((route, index) => {
            const { path, component: Component, isAllowed } = route;
            return (
              <Route
                key={index}
                path={path}
                element={
                  <PrivateRoute>
                    <Suspense>
                      {isAllowed ? <Component /> : <Error401 />}
                    </Suspense>
                  </PrivateRoute>
                }
              />
            );
          })}
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
