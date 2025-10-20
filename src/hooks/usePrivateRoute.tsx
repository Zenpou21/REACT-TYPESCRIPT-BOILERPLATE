import { RouteProps, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SHARED_KEY from "../globals/sharedKey";
import useCookie from "./useCookie";
import useEncryption from "./useEncryption";
import useCRUD from "./useCRUD";
import useLogout from "./useLogout";

export function PrivateRoute({ children }: RouteProps) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const { getCookie, setCookie } = useCookie();
  const { decryptData, encryptData } = useEncryption(SHARED_KEY);
  const { POST } = useCRUD();
  const { logout } = useLogout();
  useEffect(() => {
    const initAuth = async () => {
      const encryptedToken = await getCookie("accessToken");
      const token = encryptedToken ? decryptData(encryptedToken) : null;

      if (token) {
        setIsLoggedIn(true);
        return;
      }
      try {
        const result = await POST("refresh-token", {}, "", false);
        if (!result?.access_token) {
          await setCookie("accessToken", encryptData(result.access_token), {
            expiresInSeconds: 10,
          });
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          logout();
        }
      } catch (err) {
        console.error("Refresh token failed:", err);
        setIsLoggedIn(false);
        logout();
      }
    };

    initAuth();
  }, [navigate]);

  return isLoggedIn ? <>{children}</> : null;
}
