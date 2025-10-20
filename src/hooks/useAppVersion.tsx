import { useEffect, useState } from "react";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

export function useAppVersion() {
  const [version, setVersion] = useState("Web Version");

  useEffect(() => {
    const fetchVersion = async () => {
      if (Capacitor.getPlatform() !== "web") {
        try {
          const info = await App.getInfo();
          setVersion(info.version);
        } catch (error) {
          console.error("Error fetching app version:", error);
        }
      }
    };

    fetchVersion();
  }, []);

  return version;
}
