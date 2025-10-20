import { useCallback } from "react";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

const platform = Capacitor.getPlatform();

function useLocalStorageUtils() {
  const setLocalStorageData = useCallback(
    async <T>(key: string, value: T) => {
      try {
        const jsonValue = JSON.stringify(value);

        if (platform === "web") {
          localStorage.setItem(key, jsonValue);
        } else {
          await Preferences.set({ key, value: jsonValue });
          console.log(`[Preferences] Set ${key}:`, jsonValue);
        }
      } catch (error) {
        console.error(`Error setting storage key "${key}":`, error);
      }
    },
    [platform]
  );

  const getLocalStorageData = useCallback(<T>(key: string): Promise<T | null> => {
    return new Promise(async (resolve) => {
      try {
        if (platform === "web") {
          const item = localStorage.getItem(key);
          resolve(item ? (JSON.parse(item) as T) : null);
        } else {
          const result = await Preferences.get({ key });
          console.log(`[Preferences] Get ${key}:`, result.value);
          resolve(result.value ? (JSON.parse(result.value) as T) : null);
        }
      } catch (error) {
        console.error(`Error reading storage key "${key}":`, error);
        resolve(null);
      }
    });
  }, [platform]);

  const deleteLocalStorageData = useCallback(
    async (key: string) => {
      try {
        if (platform === "web") {
          localStorage.removeItem(key);
        } else {
          await Preferences.remove({ key });
          console.log(`[Preferences] Removed ${key}`);
        }
      } catch (error) {
        console.error(`Error deleting storage key "${key}":`, error);
      }
    },
    [platform]
  );

  return { setLocalStorageData, getLocalStorageData, deleteLocalStorageData };
}

export default useLocalStorageUtils;
