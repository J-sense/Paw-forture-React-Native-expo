import { useProfile } from "@/hooks/useAuth";
import { clearTokens } from "@/utils/token";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "burnt";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  hasUnreadNotification?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuPress,
  onProfilePress,
  onNotificationPress,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 1. Fetch profile from /auth/profile/
  const { data: profileResponse, isLoading } = useProfile();

  // 2. Console log the fetched profile data
  useEffect(() => {
    if (profileResponse) {
      console.log(
        "👤 [Profile API Data /auth/profile/]:",
        JSON.stringify(profileResponse, null, 2)
      );
    }
  }, [profileResponse]);

  // Extract email and status from response data
  const profileData = (profileResponse as any)?.data;
  const email = profileData?.email || "";
  const status =
    profileData?.status ||
    (profileData?.is_active ? "active" : undefined) ||
    "active";

  const handleToggleDropdown = () => {
    if (onProfilePress) {
      onProfilePress();
      return;
    }
    if (onNotificationPress && !isDropdownOpen) {
      onNotificationPress();
    }
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    try {
      await clearTokens();
      queryClient.clear();
      toast({
        title: "Logged Out",
        message: "已成功登出帳號。",
        preset: "done",
      });
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View className="flex-row items-center justify-between py-2 px-1 bg-transparent z-30">
      {/* Left Spacer to preserve exact center & right alignment */}
      <View className="w-10 h-10" />

      {/* Center Title */}
      <View className="items-center justify-center">
        <Text
          className="font-zen-medium text-center justify-center text-main-text text-2xl leading-7 tracking-wide"
          style={{ fontFamily: "ZenMaruGothic-Bold", color: "#5D3327" }}
        >
          貓掌命運手帳
        </Text>
        <Text
          className="text-[11px] leading-4 text-[#5D3327]"
          style={{ fontFamily: "ZenMaruGothic-Bold", color: "#5D3327" }}
        >
          · Cat Paw Destiny
        </Text>
      </View>

      {/* Right Profile Dropdown Trigger Button */}
      <Pressable
        onPress={handleToggleDropdown}
        className="w-10 h-10 bg-white rounded-full border border-pink-200 justify-center items-center active:opacity-70 relative"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        <View className="w-9 h-9 rounded-full bg-pink-100 items-center justify-center border-2 border-white">
          <Ionicons name="person" size={17} color="#DF4587" />
        </View>

        {/* Small Active Indicator Dot */}
        <View className="w-3 h-3 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 border-2 border-white" />
      </Pressable>

      {/* Profile Dropdown Modal */}
      <Modal
        visible={isDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <Pressable
          onPress={() => setIsDropdownOpen(false)}
          className="flex-1 bg-black/25"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: insets.top + 50,
              right: 14,
              width: 250,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
            className="bg-[#FFFDF8] rounded-[24px] p-4 border-2 border-[#E5A93C]/35"
          >
            {isLoading ? (
              <View className="py-4 items-center justify-center">
                <ActivityIndicator size="small" color="#DF4587" />
                <Text
                  className="text-xs text-[#5D3327] mt-2 font-medium"
                  style={{ fontFamily: "ZenMaruGothic-Medium" }}
                >
                  載入中 Loading...
                </Text>
              </View>
            ) : (
              <>
                {/* User Profile Card: Email & Status */}
                <View className="flex-row items-center gap-3 pb-3 border-b border-[#F2E5D0]">
                  <View className="w-10 h-10 rounded-full bg-pink-100 items-center justify-center border border-pink-200">
                    <Text className="text-lg">🐱</Text>
                  </View>

                  <View className="flex-1">
                    <Text
                      className="text-[10px] text-[#A89F91] font-bold uppercase tracking-wider"
                      style={{ fontFamily: "Sora-Bold" }}
                    >
                      帳號 Email
                    </Text>
                    <Text
                      className="text-xs font-bold text-[#5D3327] mt-0.5"
                      numberOfLines={1}
                      style={{ fontFamily: "ZenMaruGothic-Bold" }}
                    >
                      {email || "未提供電子郵件"}
                    </Text>

                    {/* Status Badge */}
                    <View className="flex-row items-center gap-1.5 mt-1.5">
                      <View
                        className={`w-2 h-2 rounded-full ${status === "active" ? "bg-emerald-500" : "bg-amber-400"
                          }`}
                      />
                      <Text
                        className={`text-[10.5px] font-bold capitalize ${status === "active" ? "text-emerald-700" : "text-amber-700"
                          }`}
                        style={{ fontFamily: "Sora-Bold" }}
                      >
                        狀態 Status: {status}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                  onPress={handleLogout}
                  className="flex-row items-center justify-center gap-2 bg-[#FFF0F0] border border-[#FCDADA] py-2.5 rounded-2xl active:opacity-80 mt-3 shadow-xs"
                >
                  <Ionicons name="log-out-outline" size={17} color="#E05353" />
                  <Text
                    className="text-xs font-bold text-[#E05353]"
                    style={{ fontFamily: "ZenMaruGothic-Bold" }}
                  >
                    登出帳號 / Log Out
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Header;
