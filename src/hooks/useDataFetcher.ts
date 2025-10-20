import useSWR from "swr";
import API_BASE_URL from "../globals/apiConfig"; 
import useCookie from "./useCookie";
import useEncryption from "./useEncryption";
import SHARED_KEY from "../globals/sharedKey";
import { useEffect, useState } from "react";

const useDataFetcher = ( endpoint: string, api?: string) => {
  const { getCookie } = useCookie();
  const { decryptData } = useEncryption(SHARED_KEY);

  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      let cookieName = "wms_token";
      const cookie = await getCookie(cookieName);
      if (cookie) {
        const token = await decryptData(cookie);
        setAccessToken(token);
      }
    };
      fetchAccessToken();
  }, [getCookie, decryptData, api]);

  const url = `${API_BASE_URL}${endpoint}`;

  const fetcher = async (url: string): Promise<any> => {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const result = await response.json();
    return result.success?.data || result.data || result;
  };

  const { data, error } = useSWR(accessToken ? url : null, fetcher, {
    refreshInterval: 15000,
  });

  return { data, isLoading: !data && !error, error };
};

export default useDataFetcher;