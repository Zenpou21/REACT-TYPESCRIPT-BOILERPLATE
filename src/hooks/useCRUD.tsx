import useSWR, { mutate } from "swr";
import apiRequest from "./useAPIRequest";
import { useToast } from "./useToast";

const useCRUD = () => {
  const handleApiResponse = (response: any, isToast: boolean = true) => {
    if (response?.success) {
      if (isToast) {
        useToast(response?.success?.message, "success");
      }
      return response?.success?.data;
    } else {
      useToast(
        response?.error?.message || "An unexpected error occurred",
        "danger"
      );
      return response?.error || "An unexpected error occurred";
    }
  };

  const handleError = (error: any) => {
    useToast(error?.message || "An unexpected error occurred", "danger");
  };

  const GET = (
    endpoint: string,
    id: any = null,
    externalUrl: string = "",
    refreshInterval: number = 15000
  ) => {
    const url = id ? `${endpoint}/get/${id}` : endpoint;

    const {
      data,
      error,
      isLoading,
      mutate: revalidate,
    } = useSWR(
      [externalUrl, url],
      ([api, path]) => apiRequest(api, path, {}, "GET"),
      {
        revalidateOnFocus: true,
        shouldRetryOnError: true,
        refreshInterval,
      }
    );

    return { data: data?.success?.data, error, isLoading, revalidate };
  };

  const POST = async (
    endpoint: string,
    formData: any,
    externalUrl: string = "",
    showToast: boolean = true
  ) => {
    try {
      const response = await apiRequest(
        externalUrl,
        endpoint,
        formData,
        "POST"
      );
      const result = handleApiResponse(response, showToast);

      mutate([externalUrl, endpoint]);
      return result;
    } catch (error: any) {
      handleError(error);
    }
  };

  const PUT = async (
    endpoint: string,
    id: any,
    formData: any,
    externalUrl: string = "",
    showToast: boolean = true
  ) => {
    try {
      const response = await apiRequest(
        externalUrl,
        `${endpoint}/update/${id}`,
        formData,
        "PUT"
      );
      const result = handleApiResponse(response, showToast);

      mutate([externalUrl, endpoint]);
      return result;
    } catch (error: any) {
      handleError(error);
    }
  };

  const DELETE = async (
    endpoint: string,
    id: any,
    externalUrl: string = ""
  ) => {
    try {
      const response = await apiRequest(
        externalUrl,
        `${endpoint}/delete/${id}`,
        [],
        "DELETE"
      );
      const result = handleApiResponse(response);

      mutate([externalUrl, endpoint]);
      return result;
    } catch (error: any) {
      handleError(error);
    }
  };

  return { GET, POST, PUT, DELETE };
};

export default useCRUD;
