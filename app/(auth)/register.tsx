import { AuthInput } from "@/components/auth/AuthInput";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { useSignup } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { toast } from 'burnt';
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const heroTopRight = require("../../assets/images/hero-top-right.png");

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mutate: signup, isPending: isSubmitting } = useSignup();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const bottomPadding = 30 + (insets.bottom > 0 ? insets.bottom : 16);

  const validate = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError("請輸入電子郵件 Please enter your email");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setEmailError("請輸入有效的電子郵件 Please enter a valid email");
      isValid = false;
    }

    if (!password) {
      setPasswordError("請設定密碼 Please enter a password");
      isValid = false;
    } else if (password.length < 4) {
      setPasswordError("密碼至少需8個字符 Password must be at least 4 characters");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("請再次輸入密碼 Please confirm your password");
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("兩次密碼輸入不一致 Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = () => {
    if (!validate() || isSubmitting) return;

    signup(
      {
        email: email.trim(),
        password,
      },
      {
        onSuccess: (res: any) => {
          console.log("Signup Success:", res);

          toast({
            title: res?.message_eng || "Registration Successful",
            message: res?.message_chinese || "歡迎加入！",
            preset: "done",
            duration: 10,
          });

          setTimeout(() => {
            router.replace({
              pathname: "/(auth)/verify-otp",
              params: { email: email.trim() },
            });
          }, 1200);
        },
        onError: (error: any) => {
          toast({
            title:
              error?.response?.data?.message_eng ||
              error?.message ||
              "Registration Failed",
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
          {/* Top Bar with Back Button & Title */}
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

          {/* Hero Banner Row */}
          <View className="w-full flex-row items-center justify-between my-2 px-2">
            <View className="flex-1 pr-2">
              <Text
                className="text-[26px] font-extrabold text-[#43160E] leading-tight"
                style={{ fontFamily: "ZenMaruGothic-Black" }}
              >
                開啟<Text className="text-[#F43F5E]">命運</Text>手帳
              </Text>
              <Text
                className="text-xs font-bold text-[#5D3327] mt-1.5"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                創建專屬你的貓掌命運手帳檔案
              </Text>
              <Text
                className="text-[11px] text-[#7A5348] leading-4 mt-1 font-medium"
                style={{ fontFamily: "Sora-Medium" }}
              >
                Create your destiny profile and make a promise for tomorrow.
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

          {/* Main Form White Card */}
          <View
            className="w-full bg-white rounded-[32px] p-5 border border-[#F5E6CA] my-1"
            style={styles.mainCardShadow}
          >
            {/* Card Header Badge */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Text className="text-lg mr-1.5">✨</Text>
                <Text
                  className="text-base font-bold text-[#43160E]"
                  style={{ fontFamily: "ZenMaruGothic-Bold" }}
                >
                  新用戶註冊 Register
                </Text>
              </View>
              <View className="bg-[#FFF8EC] border border-[#F5E6CA] px-2.5 py-0.5 rounded-full">
                <Text
                  className="text-[10px] font-bold text-[#B66B20]"
                  style={{ fontFamily: "Sora-Bold" }}
                >
                  NEW PROFILE
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
              label="設定密碼"
              labelEn="Create Password"
              iconName="lock-closed-outline"
              isPassword
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError("");
              }}
              placeholder="至少6位英數字"
              error={passwordError}
            />

            <AuthInput
              label="確認密碼"
              labelEn="Confirm Password"
              iconName="shield-checkmark-outline"
              isPassword
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmPasswordError) setConfirmPasswordError("");
              }}
              placeholder="再次輸入相同密碼"
              error={confirmPasswordError}
            />

            {/* Terms Notice Banner */}
            <View className="bg-[#FFF8EC] border border-[#F5E6CA] rounded-2xl p-3 flex-row items-start gap-2.5 my-2">
              <Ionicons name="information-circle-outline" size={16} color="#B66B20" style={{ marginTop: 1 }} />
              <Text
                className="flex-1 text-[11px] text-[#7A5348] leading-4"
                style={{ fontFamily: "ZenMaruGothic-Medium" }}
              >
                點擊「註冊手帳」即表示你同意使用條款及隱私政策，並將安全加密保存你的個人信件。
              </Text>
            </View>

            {/* Register Action Pill Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isSubmitting}
              activeOpacity={0.9}
              className="w-full bg-[#F43F5E] rounded-full py-3.5 px-6 flex-row items-center justify-between mt-3"
              style={styles.primaryBtnShadow}
            >
              <Ionicons name="sparkles" size={20} color="#FFFFFF" />

              <View className="items-center flex-1 px-2">
                <Text
                  className="text-base font-extrabold text-white text-center leading-tight"
                  style={{ fontFamily: "ZenMaruGothic-Bold" }}
                >
                  {isSubmitting ? "建立中..." : "註冊手帳"}
                </Text>
                <Text
                  className="text-xs font-bold text-white/90 text-center leading-tight mt-0.5"
                  style={{ fontFamily: "Sora-Bold" }}
                >
                  {isSubmitting ? "Creating Profile..." : "Create My Account"}
                </Text>
              </View>

              <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#F43F5E" />
                ) : (
                  <Ionicons name="chevron-forward" size={16} color="#F43F5E" />
                )}
              </View>
            </TouchableOpacity>

            {/* Switch to Login */}
            <View className="flex-row items-center justify-center mt-5">
              <Text
                className="text-xs text-[#7A5348]"
                style={{ fontFamily: "ZenMaruGothic-Medium" }}
              >
                已有手帳帳號？ Already have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/login")}
                activeOpacity={0.7}
              >
                <Text
                  className="text-xs font-bold text-[#F43F5E] underline"
                  style={{ fontFamily: "ZenMaruGothic-Bold" }}
                >
                  立即登入 Sign In
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
