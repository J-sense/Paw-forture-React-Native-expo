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
  try {
    const response = await axiosInstance.get<T>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error: any) {
    console.error(`❌ [httpGet] ${endpoint}:`, error?.response?.data || error.message);
    throw error;
  }
};

export const httpPost = async <T = any>(
  endpoint: string,
  data?: unknown,
  options?: ApiRequestOptions
): Promise<T> => {
  try {
    const response = await axiosInstance.post<T>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error: any) {
    console.error(`❌ [httpPost] ${endpoint}:`, error?.response?.data || error.message);
    throw error;
  }
};

export const httpPut = async <T = any>(
  endpoint: string,
  data?: unknown,
  options?: ApiRequestOptions
): Promise<T> => {
  try {
    const response = await axiosInstance.put<T>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error: any) {
    console.error(`❌ [httpPut] ${endpoint}:`, error?.response?.data || error.message);
    throw error;
  }
};

export const httpDelete = async <T = any>(
  endpoint: string,
  options?: ApiRequestOptions
): Promise<T> => {
  try {
    const response = await axiosInstance.delete<T>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error: any) {
    console.error(`❌ [httpDelete] ${endpoint}:`, error?.response?.data || error.message);
    throw error;
  }
};

export const httpPatch = async <T = any>(
  endpoint: string,
  data?: unknown,
  options?: ApiRequestOptions
): Promise<T> => {
  try {
    const response = await axiosInstance.patch<T>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error: any) {
    console.error(`❌ [httpPatch] ${endpoint}:`, error?.response?.data || error.message);
    throw error;
  }
};

export const httpClient = {
  get: httpGet,
  post: httpPost,
  httPost: httpPost, // Alias for backward compatibility
  put: httpPut,
  delete: httpDelete,
  patch: httpPatch,
};
