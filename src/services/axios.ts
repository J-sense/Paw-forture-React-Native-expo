import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthToken } from "@/utils/token";
import { logGetSuccess } from "@/utils/get.log";
import { logSuccess } from "@/utils/post.log";
import { logError } from "@/utils/error.log";

const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.example.com";

// Create a single shared Axios instance
export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Automatically inject Authorization header if token exists
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Failed to attach auth token to request:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global success/error logging & handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const method = response.config.method?.toUpperCase() || "GET";
    if (method === "GET") {
      logGetSuccess(axiosInstance, response);
    } else {
      logSuccess(method, response, response.config.data);
    }
    return response;
  },
  (error) => {
    const method = error.config?.method?.toUpperCase() || "REQUEST";
    logError(method, error, error.config?.data);

    // Global 401 Unauthorized handling (e.g. redirect to login or clear token)
    if (error.response?.status === 401) {
      console.warn("Unauthorized request (401). Token might be expired.");
    }

    return Promise.reject(error);
  }
);
