import { useState, useEffect, useCallback } from 'react';
import useEncryption from './useEncryption';
import useCookie from './useCookie';

const useDecryptedUserData = () => {
  const { getCookie } = useCookie();
  const { decryptData } = useEncryption('e1Tj9ujYluwL9J3Ei5EemRugYYSyioLaKFYsnFgbEtY=');

  const [decryptedUserData, setDecryptedUserData] = useState<string | null>(null);

  useEffect(() => {
    const fetchDecryptedData = async () => {
      const encryptedUserData = await getCookie("userDetails");

      if (encryptedUserData) {
        const decryptedData = await decryptData(encryptedUserData);
        setDecryptedUserData(decryptedData);
      } else {
        setDecryptedUserData(null);
      }
    };

    fetchDecryptedData();
  }, [getCookie, decryptData]);

  const userData = useCallback(
    (type: string) => {
      if (decryptedUserData) {
        try {
          const parsedData = JSON.parse(decryptedUserData);
          return parsedData?.userDetails?.[type];
        } catch (error) {
          console.error('Failed to parse decrypted user data', error);
        }
      }

      return null;
    },
    [decryptedUserData]
  );

  return userData;
};

export default useDecryptedUserData;
