/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "./axios";

export interface ApiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export const httpGet = async <T = any>(
  endpoint: string,
  options?: ApiRequestOptions
): Promise<T> => {
  const response = await axiosInstance.get<T>(endpoint, {
    params: options?.params,
    headers: options?.headers,
  });
  return response.data;
};

export const httpPost = async <T = any>(
  endpoint: string,
  data?: unknown,
  options?: ApiRequestOptions
): Promise<T> => {
  const response = await axiosInstance.post<T>(endpoint, data, {
    params: options?.params,
    headers: options?.headers,
  });
  return response.data;
};

export const httpPut = async <T = any>(
  endpoint: string,
  data?: unknown,
  options?: ApiRequestOptions
): Promise<T> => {
  const response = await axiosInstance.put<T>(endpoint, data, {
    params: options?.params,
    headers: options?.headers,
  });
  return response.data;
};

export const httpDelete = async <T = any>(
  endpoint: string,
  options?: ApiRequestOptions
): Promise<T> => {
  const response = await axiosInstance.delete<T>(endpoint, {
    params: options?.params,
    headers: options?.headers,
  });
  return response.data;
};

export const httpPatch = async <T = any>(
  endpoint: string,
  data?: unknown,
  options?: ApiRequestOptions
): Promise<T> => {
  const response = await axiosInstance.patch<T>(endpoint, data, {
    params: options?.params,
    headers: options?.headers,
  });
  return response.data;
};

export const httpClient = {
  get: httpGet,
  post: httpPost,
  httPost: httpPost, // Alias for backward compatibility
  put: httpPut,
  delete: httpDelete,
  patch: httpPatch,
};
