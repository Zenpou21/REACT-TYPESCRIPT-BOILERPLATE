import API_BASE_URL from '../globals/apiConfig';
import SHARED_KEY from '../globals/sharedKey';
import useCookie from './useCookie';
import useEncryption from './useEncryption';

type RequestData = Record<string, any>;
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type RequestHeaders = Record<string, string>;

const { getCookie } = useCookie();
const { decryptData } = useEncryption(SHARED_KEY);

async function apiRequest(
  api: string | null,
  urlPath: string,
  requestData: RequestData = {},
  method: RequestMethod = 'GET',
  headers: RequestHeaders = { 'Content-Type': 'application/json' }
): Promise<any> {
  const cookieValue = await getCookie('accessToken');
  let accessToken: string | null = cookieValue ? decryptData(cookieValue) : null;


    const requestOptions: RequestInit = {
      method,
      credentials: 'include',
      headers: {
        ...headers,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      },
      body: method !== 'GET' ? (requestData instanceof FormData ? requestData : JSON.stringify(requestData)) : undefined,
    };

    let endpoint = api ? api + urlPath : API_BASE_URL + urlPath;
    const response = await fetch(endpoint, requestOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`) as any;
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
    return await response.json();
}


export default apiRequest;