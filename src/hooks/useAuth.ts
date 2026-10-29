import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      authService.login(payload),
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      authService.signup(payload),
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (payload: { email: string; otp: string }) =>
      authService.verifyEmail(payload),
  });
};

export const useProfile = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["authProfile"],
    queryFn: async () => {
      const data = await authService.getProfile();
      console.log("👤 [useProfile hook Data]:", data);
      return data;
    },
    ...options,
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload: { email: string }) =>
      authService.forgotPassword(payload),
  });
};


