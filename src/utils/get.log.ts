import { AxiosInstance, AxiosResponse } from "axios";

export const logGetSuccess = (_axiosInst: AxiosInstance, response: AxiosResponse) => {
  if (__DEV__) {
    console.log(`[API GET SUCCESS]`, {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
  }
};
