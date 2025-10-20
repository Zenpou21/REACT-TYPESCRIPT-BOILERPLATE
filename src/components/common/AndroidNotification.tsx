import { useEffect, useRef } from "react";
import { PushNotifications } from "@capacitor/push-notifications";
import { LocalNotifications } from "@capacitor/local-notifications";
import useCookie from "../../hooks/useCookie";
import { Device } from "@capacitor/device";
import useCrud from "../../hooks/useCRUD";
import { useNavigate } from "react-router-dom";

export const AndroidNotification = () => {
  const { getCookie, setCookie } = useCookie();
  const { POST } = useCrud();
  const listenersAdded = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initPush = async () => {
      try {
        const permissionStatus = await PushNotifications.requestPermissions();
        if (permissionStatus.receive !== "granted") {
          console.warn("🚫 Push permission not granted");
          return;
        }
        await PushNotifications.register();
        if (!listenersAdded.current) {
          listenersAdded.current = true;

          PushNotifications.addListener("registration", async (token) => {
            const savedToken = await getCookie("FCM_TOKEN");
            if (savedToken === token.value) {
              return;
            }

            await setCookie("FCM_TOKEN", token.value);

            const deviceInfo = await Device.getInfo();
            const deviceName = `${deviceInfo.manufacturer} ${deviceInfo.model}`;

            const body = {
              token: token.value,
              device_name: deviceName,
              meta: "",
            };

            await POST("fcm/create", body, "", false);
          });

          PushNotifications.addListener("registrationError", (error) => {
            console.error("❌ Registration error:", error);
          });

          PushNotifications.addListener(
            "pushNotificationReceived",
            async (notification) => {
              console.log("📩 Notification received:", notification);
              await LocalNotifications.schedule({
                notifications: [
                  {
                    title: notification.title ?? "Notification",
                    body: notification.body ?? "",
                    id: Math.floor(Date.now() % 100000),
                    schedule: { at: new Date(Date.now() + 100) },
                    extra: notification.data,
                  },
                ],
              });
            }
          );
        }
      } catch (error) {
        console.error("❌ Error initializing push notifications:", error);
      }
    };

    initPush();
  }, [getCookie, setCookie, POST]);

  useEffect(() => {
    let listenerHandle: any =  null;

    const setupListener = async () => {
      listenerHandle = await PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notification) => {
          const target = notification.notification.data?.navigateTo;
          if (target) {
            navigate(target);
          } else {
            navigate("/");
          }
        }
      );
    };

    setupListener();

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [navigate]);

  return null;
};
