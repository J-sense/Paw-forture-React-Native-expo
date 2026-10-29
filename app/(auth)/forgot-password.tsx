import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { AuthInput } from "@/components/auth/AuthInput";
import { useForgotPassword } from "@/hooks/useAuth";
import { toast } from "burnt";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mutate: forgotPassword, isPending: isSubmitting } = useForgotPassword();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const bottomPadding = 30 + (insets.bottom > 0 ? insets.bottom : 16);

  const validate = () => {
    setEmailError("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError("請輸入電子郵件 Please enter your email");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setEmailError("請輸入有效的電子郵件 Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSendOtp = () => {
    if (!validate() || isSubmitting) return;

    const trimmedEmail = email.trim();

    forgotPassword(
      { email: trimmedEmail },
      {
        onSuccess: (res: any) => {
          console.log("✅ Forgot Password Success Response:", res);
          setIsSuccess(true);

          toast({
            title:
              res?.message_eng ||
              res?.message?.en ||
              "An OTP has been sent to your email.",
            message:
              res?.message_chinese ||
              res?.message?.zh ||
              "驗證碼已發送至您的郵箱，請檢查收件箱。",
            preset: "done",
            duration: 4,
          });

          // Navigate to verify-otp with email parameter
          setTimeout(() => {
            router.push({
              pathname: "/(auth)/verify-otp",
              params: { email: trimmedEmail, mode: "reset_password" },
            });
          }, 1200);
        },
        onError: (error: any) => {
          console.error("❌ Forgot Password Error:", error);
          toast({
            title:
              error?.response?.data?.message_eng ||
              error?.response?.data?.message?.en ||
              error?.message ||
              "Failed to send reset OTP",
            message:
              error?.response?.data?.message_chinese ||
              error?.response?.data?.message?.zh,
            preset: "error",
          });
        },
      }
    );
  };

  return (
    <ScreenWrapper className="px-3">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottomPadding }}
          className="flex-1 w-full pt-1"
        >
          {/* Top Header Row with Back Button & Brand */}
          <View className="w-full flex-row items-center justify-between pt-1 pb-2 px-1">
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) router.back();
                else router.replace("/(auth)/login");
              }}
              className="w-10 h-10 rounded-full bg-white items-center justify-center border border-[#F3E8D5] active:opacity-80"
              style={styles.backBtnShadow}
            >
              <Ionicons name="arrow-back" size={20} color="#4A3E3D" />
            </TouchableOpacity>

            <View className="items-center flex-1 px-2">
              <Text
                className="text-2xl font-extrabold text-[#43160E] leading-tight text-center"
                style={{ fontFamily: "ZenMaruGothic-Black" }}
              >
                貓掌命運手帳
              </Text>
              <Text
                className="text-xs font-bold text-[#5D3327] tracking-wider text-center mt-0.5"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                · Cat Paw Destiny ·
              </Text>
            </View>

            {/* Empty view for symmetrical balancing */}
            <View className="w-10" />
          </View>

          {/* Main Card Container */}
          <View className="w-full mt-4">
            <View
              className="w-full bg-[#FFFDF8] rounded-[32px] p-6 border-2 border-[#E5A93C]/35 relative"
              style={styles.mainCardShadow}
            >
              {/* Illustration / Icon Badge */}
              <View className="items-center mb-4">
                <View className="w-16 h-16 rounded-full bg-[#FFF4DC] border-2 border-[#FDE272] items-center justify-center mb-3">
                  <Text className="text-3xl">🔑</Text>
                </View>

                <Text
                  className="text-xl font-black text-[#43160E] text-center"
                  style={{ fontFamily: "ZenMaruGothic-Black" }}
                >
                  重設密碼 / Forgot Password
                </Text>

                <Text
                  className="text-xs text-[#7A6E5F] text-center mt-2 px-2 leading-relaxed"
                  style={{ fontFamily: "ZenMaruGothic-Medium" }}
                >
                  別擔心！請輸入您註冊時使用的電子郵件信箱，我們將發送一次性驗證碼 (OTP) 協助您重設密碼。
                </Text>
                <Text
                  className="text-[11px] text-[#A89F91] text-center mt-0.5 px-3 leading-4"
                  style={{ fontFamily: "Sora-Medium" }}
                >
                  Enter your email address to receive an OTP code to reset your password.
                </Text>
              </View>

              {/* Form Input */}
              <View className="mt-2">
                <AuthInput
                  label="電子郵件"
                  labelEn="Email Address"
                  iconName="mail-outline"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="example@catpaw.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={emailError}
                />
              </View>

              {/* Info Note */}
              <View className="flex-row items-center gap-2 bg-[#FFF9EE] border border-[#F3E8D5] rounded-2xl p-3 my-2">
                <Text className="text-base">🐾</Text>
                <Text
                  className="text-[11px] text-[#8C7A6B] flex-1 leading-4"
                  style={{ fontFamily: "ZenMaruGothic-Medium" }}
                >
                  發送後請檢查您的收件箱及垃圾郵件匣。
                </Text>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSendOtp}
                disabled={isSubmitting || isSuccess}
                className="w-full bg-[#DF4587] py-3.5 rounded-2xl items-center justify-center mt-4 active:opacity-90 shadow-md"
                style={styles.primaryBtnShadow}
              >
                {isSubmitting ? (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text
                      className="text-white font-bold text-sm"
                      style={{ fontFamily: "ZenMaruGothic-Bold" }}
                    >
                      發送中 Sending OTP...
                    </Text>
                  </View>
                ) : isSuccess ? (
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                    <Text
                      className="text-white font-bold text-sm"
                      style={{ fontFamily: "ZenMaruGothic-Bold" }}
                    >
                      已發送 Sent!
                    </Text>
                  </View>
                ) : (
                  <Text
                    className="text-white font-bold text-base"
                    style={{ fontFamily: "ZenMaruGothic-Bold" }}
                  >
                    發送驗證碼 Send Reset OTP
                  </Text>
                )}
              </TouchableOpacity>

              {/* Back to Login Link */}
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/login")}
                className="flex-row items-center justify-center mt-5 py-1"
              >
                <Ionicons name="arrow-back" size={15} color="#DF4587" />
                <Text
                  className="text-xs font-bold text-[#DF4587] ml-1"
                  style={{ fontFamily: "ZenMaruGothic-Bold" }}
                >
                  返回登入頁面 Back to Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backBtnShadow: {
    shadowColor: "#5D3327",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  mainCardShadow: {
    shadowColor: "#DCB978",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryBtnShadow: {
    shadowColor: "#DF4587",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
