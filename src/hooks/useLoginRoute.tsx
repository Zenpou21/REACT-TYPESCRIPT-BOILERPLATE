import { Navigate, RouteProps } from "react-router-dom";
import { useEffect, useState } from "react";
import useCookie from "./useCookie";

async function getAccessToken() {
  const { getCookie } = useCookie();

  const encryptedToken = await getCookie("accessToken");
  return encryptedToken ? encryptedToken : null;
}

export function LoginRoute({ children }: RouteProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getAccessToken();
      setIsLoggedIn(!!token);
    };
    checkToken();
  }, []);

  if (isLoggedIn === null) return null;

  return isLoggedIn ? <Navigate to="/dashboard" /> : <>{children}</>;
}
