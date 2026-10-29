/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";

export const logError = (
  method: string,
  error: AxiosError | any,
  fallbackPayload?: any
) => {
  const config = error?.config || {};
  const { url = "", baseURL = "", data } = config;

  let payload = data;
  try {
    payload = typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    payload = fallbackPayload || data;
  }

  const fullUrl = baseURL
    ? `${baseURL}/${url}`.replace(/([^:]\/)\/+/g, "$1")
    : url || error?.config?.url;

  console.error(`🚨 [${method.toUpperCase()} ERROR] ${fullUrl}`, {
    status: error?.response?.status,
    message: error?.message,
    responseData: error?.response?.data, // Captures backend error messages (e.g. { message: "Validation failed" })
    payload,
    timestamp: new Date().toISOString(),
  });
};
