import { Preferences } from "@capacitor/preferences";
import { cookieEnvironment } from "../globals/environment";
import { Capacitor } from "@capacitor/core";

// Constants
const DEFAULT_EXPIRATION_SECONDS = 100000;
const EXPIRES_SUFFIX = "_expires";

// Types
interface CookieOptions {
  expiresInSeconds?: number;
  userId?: string;
}

interface CookieHook {
  setCookie: (name: string, value: string, options?: CookieOptions) => Promise<void>;
  getCookie: (name: string, userId?: string) => Promise<string>;
  deleteCookie: (name: string, userId?: string) => Promise<void>;
  hasValidCookie: (name: string, userId?: string) => Promise<boolean>;
}

// Helper functions
const isWebPlatform = () => Capacitor.getPlatform() === "web";

const generateKey = (name: string, userId?: string): string => 
  userId ? `${name}_${userId}` : name;

const parseCookieString = (cookieString: string): Record<string, string> => {
  const cookies: Record<string, string> = {};
  cookieString.split("; ").forEach(cookie => {
    const [name, value] = cookie.split("=");
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  return cookies;
};

const useCookie = (): CookieHook => {
  const setCookie = async (
    name: string, 
    value: string, 
    options: CookieOptions = {}
  ): Promise<void> => {
    try {
      const { expiresInSeconds = DEFAULT_EXPIRATION_SECONDS, userId } = options;
      const key = generateKey(name, userId);
      const expiresAt = Date.now() + expiresInSeconds * 1000;

      if (isWebPlatform()) {
        const expires = new Date(expiresAt).toUTCString();
        const encodedValue = encodeURIComponent(value);
        document.cookie = `${name}=${encodedValue};domain=${cookieEnvironment};path=/;expires=${expires};`;
      } else {
        await Promise.all([
          Preferences.set({ key, value }),
          Preferences.set({ key: `${key}${EXPIRES_SUFFIX}`, value: expiresAt.toString() })
        ]);
      }
    } catch (error) {
      console.error(`Failed to set cookie "${name}":`, error);
      throw new Error(`Failed to set cookie: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getCookie = async (name: string, userId?: string): Promise<string> => {
    try {
      const key = generateKey(name, userId);

      if (isWebPlatform()) {
        const cookies = parseCookieString(document.cookie);
        return cookies[name] || "";
      } else {
        // Check if cookie has expired for native platforms
        const [valueResult, expiresResult] = await Promise.all([
          Preferences.get({ key }),
          Preferences.get({ key: `${key}${EXPIRES_SUFFIX}` })
        ]);

        if (expiresResult.value) {
          const expiresAt = parseInt(expiresResult.value, 10);
          if (Date.now() > expiresAt) {
            // Cookie expired, clean it up
            await deleteCookie(name, userId);
            return "";
          }
        }

        return valueResult.value || "";
      }
    } catch (error) {
      console.error(`Failed to get cookie "${name}":`, error);
      return "";
    }
  };
  
  const deleteCookie = async (name: string, userId?: string): Promise<void> => {
    try {
      const key = generateKey(name, userId);
      
      if (isWebPlatform()) {
        document.cookie = `${name}=;domain=${cookieEnvironment};path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
      } else {
        await Promise.all([
          Preferences.remove({ key }),
          Preferences.remove({ key: `${key}${EXPIRES_SUFFIX}` })
        ]);
      }
    } catch (error) {
      console.error(`Failed to delete cookie "${name}":`, error);
      throw new Error(`Failed to delete cookie: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const hasValidCookie = async (name: string, userId?: string): Promise<boolean> => {
    try {
      const value = await getCookie(name, userId);
      return value !== "";
    } catch (error) {
      console.error(`Failed to check cookie "${name}":`, error);
      return false;
    }
  };

  return { 
    setCookie, 
    getCookie, 
    deleteCookie, 
    hasValidCookie 
  };
};

export default useCookie;
