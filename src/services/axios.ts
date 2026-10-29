import { logError } from "@/utils/error.log";
import { logGetSuccess } from "@/utils/get.log";
import { logSuccess } from "@/utils/post.log";
import { clearAuth, getAuthToken } from "@/utils/token";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { toast } from "burnt";
import { router } from "expo-router";

const apiBaseUrl = "https://desertic-troy-aeruginous.ngrok-free.dev/api/v1";
console.log(apiBaseUrl, "apiBaseUrl");

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
  async (error) => {
    const method = error.config?.method?.toUpperCase() || "REQUEST";
    logError(method, error, error.config?.data);

    // Global 401 Unauthorized handling (token expired / invalid)
    if (error.response?.status === 401) {
      console.warn("🔒 Unauthorized (401). Clearing invalid tokens and redirecting to login...");
      await clearAuth();

      // Only redirect if not already attempting login
      if (!error.config?.url?.includes("/auth/login")) {
        const errMsg =
          error.response?.data?.message_eng ||
          "Session expired. Please log in again.";
        const errMsgZh =
          error.response?.data?.message_chinese || "登入已過期，請重新登入。";

        toast({
          title: errMsg,
          message: errMsgZh,
          preset: "error",
        });

        router.replace("/(auth)/login");
      }
    }

    return Promise.reject(error);
  }
);
