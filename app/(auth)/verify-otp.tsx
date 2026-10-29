import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { useVerifyEmail } from "@/hooks/useAuth";
import { setAuthToken, setAuthUser } from "@/utils/token";
import { toast } from "burnt";

export default function VerifyOtpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = (params.email as string) || "";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const { mutate: verifyEmail, isPending: isSubmitting } = useVerifyEmail();

  const bottomPadding = 30 + (insets.bottom > 0 ? insets.bottom : 16);

  const handleOtpChange = (text: string, index: number) => {
    setErrorMsg("");

    // Support pasting full 6-digit OTP
    const cleanDigits = text.replace(/[^0-9]/g, "");
    if (cleanDigits.length > 1) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = cleanDigits[i] || "";
      }
      setOtp(newOtp);
      const nextIndex = Math.min(cleanDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleanDigits;
    setOtp(newOtp);

    // Auto-advance to next box if digit is entered
    if (cleanDigits && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setErrorMsg("請輸入完整的6位數驗證碼 Please enter all 6 digits");
      return;
    }

    if (!email) {
      setErrorMsg("缺少電子郵件 Missing email address");
      return;
    }

    verifyEmail(
      { email, otp: otpCode },
      {
        onSuccess: (res: any) => {
          console.log("OTP Verification Success:", res);

          const token = res?.access || res?.access_token || res?.token;
          if (token) {
            setAuthToken(token, res?.refresh);
          }
          if (res?.user) {
            setAuthUser(res.user);
          }

          toast({
            title: res?.message_eng || "Email Verified Successfully",
            message: res?.message_chinese || "驗證成功，請登入！",
            preset: "done",
            duration: 5,
          });

          setTimeout(() => {
            router.replace("/(auth)/login");
          }, 1200);
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message_eng ||
            error?.message ||
            "Verification Failed";
          setErrorMsg(message);
          toast({
            title: message,
            message: error?.response?.data?.message_chinese,
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
          {/* Top Header Row with Back Button */}
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
                style={{ fontFamily: "Sora-Bold" }}
              >
                ・ Cat Paw Destiny ・
              </Text>
            </View>

            <View className="w-10" />
          </View>

          {/* Main Card */}
          <View
            className="w-full bg-[#FFFDF8] rounded-[28px] border border-[#F1E4D1] p-5 mt-4"
            style={styles.mainCardShadow}
          >
            {/* Header Icon & Title */}
            <View className="items-center my-3">
              <View className="w-16 h-16 rounded-full bg-[#FFF1F2] border border-[#FECDD3] items-center justify-center mb-3">
                <Ionicons name="mail-open-outline" size={30} color="#F43F5E" />
              </View>

              <Text
                className="text-xl font-black text-[#43160E] text-center"
                style={{ fontFamily: "ZenMaruGothic-Black" }}
              >
                輸入驗證碼
              </Text>
              <Text
                className="text-xs font-bold text-[#8C6D62] tracking-wider text-center mt-0.5"
                style={{ fontFamily: "Sora-Bold" }}
              >
                Enter Verification Code
              </Text>

              <Text
                className="text-xs text-[#7A5348] text-center mt-3 px-2 leading-relaxed"
                style={{ fontFamily: "ZenMaruGothic-Medium" }}
              >
                我們已將6位數驗證碼寄送至：{"\n"}
                <Text className="font-extrabold text-[#43160E]">
                  {email || "你的電子郵件"}
                </Text>
              </Text>
            </View>

            {/* 6-Digit OTP Boxes */}
            <View className="flex-row justify-between items-center my-6 px-1">
              {otp.map((digit, idx) => {
                const isFilled = digit.length > 0;
                return (
                  <TextInput
                    key={idx}
                    ref={(ref) => {
                      inputRefs.current[idx] = ref;
                    }}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, idx)}
                    onKeyPress={(e) => handleKeyPress(e, idx)}
                    keyboardType="number-pad"
                    maxLength={idx === 0 ? 6 : 1}
                    selectTextOnFocus
                    className={`w-12 h-14 rounded-2xl text-center text-xl font-black border-2 bg-white ${
                      isFilled
                        ? "border-[#F43F5E] text-[#43160E]"
                        : "border-[#EADBC8] text-[#43160E]"
                    }`}
                    style={styles.otpBoxShadow}
                  />
                );
              })}
            </View>

            {/* Error Message */}
            {errorMsg ? (
              <View className="flex-row items-center justify-center mb-4 px-2">
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text
                  className="text-xs text-[#DC2626] font-bold ml-1.5 text-center"
                  style={{ fontFamily: "ZenMaruGothic-Bold" }}
                >
                  {errorMsg}
                </Text>
              </View>
            ) : null}

            {/* Verify Button */}
            <TouchableOpacity
              onPress={handleVerify}
              disabled={isSubmitting}
              activeOpacity={0.9}
              className="w-full bg-[#F43F5E] rounded-full py-3.5 px-6 flex-row items-center justify-between mt-2"
              style={styles.primaryBtnShadow}
            >
              {isSubmitting ? (
                <View className="flex-1 items-center justify-center py-1">
                  <ActivityIndicator color="#FFFFFF" />
                </View>
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />

                  <View className="items-center flex-1 px-2">
                    <Text
                      className="text-base font-extrabold text-white text-center leading-tight"
                      style={{ fontFamily: "ZenMaruGothic-Bold" }}
                    >
                      確認驗證
                    </Text>
                    <Text
                      className="text-xs font-bold text-white/90 text-center leading-tight mt-0.5"
                      style={{ fontFamily: "Sora-Bold" }}
                    >
                      Verify & Continue
                    </Text>
                  </View>

                  <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
                    <Ionicons name="chevron-forward" size={16} color="#F43F5E" />
                  </View>
                </>
              )}
            </TouchableOpacity>

            {/* Back to Login link */}
            <View className="flex-row items-center justify-center mt-6">
              <Text
                className="text-xs text-[#7A5348]"
                style={{ fontFamily: "ZenMaruGothic-Medium" }}
              >
                已經有帳號了嗎？ Already verified?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/login")}
                activeOpacity={0.7}
              >
                <Text
                  className="text-xs font-bold text-[#F43F5E] underline"
                  style={{ fontFamily: "ZenMaruGothic-Bold" }}
                >
                  前往登入 Sign In
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
    shadowColor: "#F43F5E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  otpBoxShadow: {
    shadowColor: "#5D3327",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
});
