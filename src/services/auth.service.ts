import { httpPost, httpGet } from "./api";

export interface UserProfileData {
  id: number;
  email: string;
  status: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfileResponse {
  success: boolean;
  status_code: number;
  message?: {
    en: string;
    zh: string;
  };
  message_eng?: string;
  message_chinese?: string;
  data: UserProfileData;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  status_code: number;
  message?: {
    en: string;
    zh: string;
  };
  message_eng?: string;
  message_chinese?: string;
  data?: any;
}

// 1. Pure API Functions
export const authService = {
    signup: async (payload: any) => {
        const endpoint = "/auth/signup/";
        console.log("➡️ Endpoint:", endpoint);
        console.log("📦 Payload:", payload);

        const result = await httpPost(endpoint, payload);
        console.log("✅ Response:", result);
        return result;
    },
    login: async (payload: any) => {
        const endpoint = "/auth/login/";
        console.log("➡️ Endpoint:", endpoint);
        console.log("📦 Payload:", payload);

        const result = await httpPost(endpoint, payload);
        console.log("✅ Response:", result);
        return result;
    },
    verifyEmail: async (payload: { email: string; otp: string }) => {
        const endpoint = "/auth/signup/verify-email/";
        console.log("➡️ Endpoint:", endpoint);
        console.log("📦 Payload:", payload);

        const result = await httpPost(endpoint, payload);
        console.log("✅ Response:", result);
        return result;
    },
    getProfile: async (): Promise<UserProfileResponse> => {
        const endpoint = "/auth/profile/";
        console.log("➡️ [GET Profile] Endpoint:", endpoint);
        const result = await httpGet<UserProfileResponse>(endpoint);
        console.log("✅ [GET Profile Response]:", result);
        return result;
    },
    forgotPassword: async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
        const endpoint = "/auth/forgot-password/";
        console.log("➡️ [Forgot Password] Endpoint:", endpoint);
        console.log("📦 Payload:", payload);

        const result = await httpPost<ForgotPasswordResponse>(endpoint, payload);
        console.log("✅ [Forgot Password Response]:", result);
        return result;
    },
};