import { Capacitor } from "@capacitor/core";
import React, { useEffect, useRef, useCallback } from "react";
import { Preferences } from "@capacitor/preferences";
import { useNavigate } from "react-router-dom";
import { Button, useDisclosure } from "@heroui/react";
import ModalComponent from "./ModalComponent/ModalComponent";
import useCookie from "../../hooks/useCookie";
import useLocalStorageUtils from "../../hooks/useLocalStorageUtils";

const INACTIVITY_LIMIT = 10 * 60 * 1000;

const InactivityHandler: React.FC = () => {
  const platformIsWeb = Capacitor.getPlatform() === "web";
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { deleteCookie } = useCookie();
  const { getLocalStorageData, setLocalStorageData, deleteLocalStorageData } =
    useLocalStorageUtils();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleInactivity = useCallback(async () => {
    if (platformIsWeb) {
      document.cookie.split(";").forEach(async (cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        await deleteCookie(cookieName);
      });

      Object.keys(localStorage).forEach((key) => {
        if (key !== "theme") {
          deleteLocalStorageData(key);
        }
      });
    } else {
      const { keys } = await Preferences.keys();
      await Promise.all(keys.map((key) => Preferences.remove({ key })));
    }

    navigate("/login");
  }, [deleteCookie, deleteLocalStorageData, navigate, platformIsWeb]);

  const showSessionExpiredModal = useCallback(() => {
    onOpen();
    setLocalStorageData("la", new Date().toISOString());
    window.location.reload();
  }, [onOpen, setLocalStorageData]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(showSessionExpiredModal, INACTIVITY_LIMIT);
  }, [showSessionExpiredModal]);

  useEffect(() => {
    const activityEvents = [
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
      "touchstart",
    ];

    (async () => {
      const la = await getLocalStorageData("la");
      if (la) onOpen();
    })();

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );
    resetTimer(); 

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [getLocalStorageData, onOpen, resetTimer]);

  return (
    <ModalComponent
      size="sm"
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showFooterButtons={false}
      hideCloseButton={true}
    >
      <div className="mt-5 mb-5">
        <div className="text-center text-sm mb-3">
          Your session has expired due to inactivity.
        </div>
        <div className="flex justify-center items-center mt-10">
          <Button
            onPress={handleInactivity}
            size="sm"
            className="text-sm"
            radius="sm"
            color="primary"
          >
            Confirm
          </Button>
        </div>
      </div>
    </ModalComponent>
  );
};

export default InactivityHandler;
