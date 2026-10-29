import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
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
import { useLogin } from "@/hooks/useAuth";
import { setAuthToken, setAuthUser } from "@/utils/token";
import { toast } from "burnt";

const heroTopRight = require("../../assets/images/hero-top-right.png");

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mutate: login, isPending: isSubmitting } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const bottomPadding = 30 + (insets.bottom > 0 ? insets.bottom : 16);

  const validate = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError("請輸入電子郵件 Please enter your email");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setEmailError("請輸入有效的電子郵件 Please enter a valid email");
      isValid = false;
    }

    if (!password) {
      setPasswordError("請輸入密碼 Please enter your password");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = () => {
    if (!validate() || isSubmitting) return;

    login(
      { email: email.trim(), password },
      {
        onSuccess: (res: any) => {
          console.log("Login Success:", res);

          const token = res?.access || res?.access_token || res?.token;
          if (token) {
            setAuthToken(token, res?.refresh);
          }
          if (res?.user) {
            setAuthUser(res.user);
          }

          toast({
            title: res?.message_eng || "Login Successful",
            message: res?.message_chinese || "歡迎回來！",
            preset: "done",
          });

          setTimeout(() => {
            router.replace("/(tabs)");
          }, 1000);
        },
        onError: (error: any) => {
          toast({
            title:
              error?.response?.data?.message_eng ||
              error?.message ||
              "Login Failed",
            message: error?.response?.data?.message_chinese,
            preset: "error",
          });
        },
      }
    );
  };

  const handleForgotPassword = () => {
    router.push("/(auth)/forgot-password");
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
                else router.replace("/(tabs)");
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

          {/* Hero Banner with Cute Cat Graphic */}
          <View className="w-full flex-row items-center justify-between my-2 px-2">
            <View className="flex-1 pr-2">
              <Text
                className="text-[26px] font-extrabold text-[#43160E] leading-tight"
                style={{ fontFamily: "ZenMaruGothic-Black" }}
              >
                歡迎<Text className="text-[#F43F5E]">回來</Text>
              </Text>
              <Text
                className="text-xs font-bold text-[#5D3327] mt-1.5"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                登入以同步你的命運手帳與信件
              </Text>
              <Text
                className="text-[11px] text-[#7A5348] leading-4 mt-1 font-medium"
                style={{ fontFamily: "Sora-Medium" }}
              >
                Sign in to sync your destiny journal, stamps & letters.
              </Text>
            </View>

            <View className="w-[110px] h-[105px] items-center justify-center">
              <Image
                source={heroTopRight}
                style={{ width: 110, height: 105 }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Main White Card Container */}
          <View
            className="w-full bg-white rounded-[32px] p-5 border border-[#F5E6CA] my-1"
            style={styles.mainCardShadow}
          >
            {/* Form Title Badge */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Text className="text-lg mr-1.5">🐾</Text>
                <Text
                  className="text-base font-bold text-[#43160E]"
                  style={{ fontFamily: "ZenMaruGothic-Bold" }}
                >
                  帳號登入 Sign In
                </Text>
              </View>
              <View className="bg-[#FFF8EC] border border-[#F5E6CA] px-2.5 py-0.5 rounded-full">
                <Text
                  className="text-[10px] font-bold text-[#B66B20]"
                  style={{ fontFamily: "Sora-Bold" }}
                >
                  SECURE AUTH
                </Text>
              </View>
            </View>

            {/* Inputs */}
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

            <AuthInput
              label="登入密碼"
              labelEn="Password"
              iconName="lock-closed-outline"
              isPassword
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError("");
              }}
              placeholder="••••••••"
              error={passwordError}
            />

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              activeOpacity={0.7}
              className="self-end -mt-2 mb-4 py-1"
            >
              <Text
                className="text-xs font-bold text-[#B66B20]"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                忘記密碼？ Forgot Password
              </Text>
            </TouchableOpacity>

            {/* Main Action Pill Button (Sign In) */}
            <TouchableOpacity
              onPress={handleLogin}
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
                  <Ionicons name="log-in-outline" size={22} color="#FFFFFF" />

                  <View className="items-center flex-1 px-2">
                    <Text
                      className="text-base font-extrabold text-white text-center leading-tight"
                      style={{ fontFamily: "ZenMaruGothic-Bold" }}
                    >
                      登入手帳
                    </Text>
                    <Text
                      className="text-xs font-bold text-white/90 text-center leading-tight mt-0.5"
                      style={{ fontFamily: "Sora-Bold" }}
                    >
                      Sign In to Account
                    </Text>
                  </View>

                  <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
                    <Ionicons name="chevron-forward" size={16} color="#F43F5E" />
                  </View>
                </>
              )}
            </TouchableOpacity>

            {/* Switch to Register */}
            <View className="flex-row items-center justify-center mt-6">
              <Text
                className="text-xs text-[#7A5348]"
                style={{ fontFamily: "ZenMaruGothic-Medium" }}
              >
                還沒有帳號嗎？ Don't have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/register")}
                activeOpacity={0.7}
              >
                <Text
                  className="text-xs font-bold text-[#F43F5E] underline"
                  style={{ fontFamily: "ZenMaruGothic-Bold" }}
                >
                  立即註冊 Sign Up
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
    elevation: 6,
  },
});
