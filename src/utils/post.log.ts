import { AxiosResponse } from "axios";

export const logSuccess = (method: string, response: AxiosResponse, payload?: unknown) => {
  if (__DEV__) {
    console.log(`[API ${method} SUCCESS]`, {
      url: response.config.url,
      status: response.status,
      payload,
      response: response.data,
    });
  }
};
