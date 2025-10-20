import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import useCookie from "./useCookie";
import useLocalStorageUtils from "./useLocalStorageUtils";
import useCrud from "./useCRUD";

export default function useLogout() {
  const navigate = useNavigate();
  const { deleteCookie } = useCookie();
  const { deleteLocalStorageData } = useLocalStorageUtils();
  const { POST } = useCrud();
  const isWeb = Capacitor.getPlatform() === "web";

  const logout = async (redirect: boolean = true) => {
    try {
      console.log('Logging out...');
      await POST("logout", {});
    } catch (error) {
      console.error("Logout API call failed:", error);
    }

    if (isWeb) {
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const cookieName = cookie.split("=")[0].trim();
        await deleteCookie(cookieName);
      }

      Object.keys(localStorage).forEach((key) => {
        if (key !== "theme") {
          deleteLocalStorageData(key);
        }
      });
    } else {
      const { keys } = await Preferences.keys();
      for (const key of keys) {
        await Preferences.remove({ key });
      }
    }

    if (redirect) {
      navigate("/login");
    }
  };

  return { logout };
}
