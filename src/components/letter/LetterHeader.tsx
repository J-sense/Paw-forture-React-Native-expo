import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface LetterHeaderProps {
  onAddPress?: () => void;
  onBackPress?: () => void;
}

export const LetterHeader: React.FC<LetterHeaderProps> = ({
  onAddPress,
  onBackPress,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate("/" as any);
    }
  };

  return (
    <View className="w-full flex-row items-center justify-between pt-1 pb-3 px-1">
      {/* Left Back Arrow */}
      <TouchableOpacity
        onPress={handleBack}
        className="w-10 h-10 rounded-full bg-white/90 items-center justify-center border border-[#F3E8D5] shadow-sm active:opacity-80"
        style={{
          shadowColor: "rgba(93, 51, 39, 0.12)",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Ionicons name="arrow-back" size={20} color="#4A3E3D" />
      </TouchableOpacity>

      {/* Center Title Group */}
      <View className="items-center flex-1 px-2">
        <Text
          className="text-xl font-extrabold text-[#3A2E2B] leading-tight"
          style={{ fontFamily: "ZenMaruGothic-Black" }}
        >
          我的信件
        </Text>
        <Text
          className="text-xs font-bold text-[#8C7B75] tracking-wide mb-1"
          style={{ fontFamily: "Sora-Bold" }}
        >
          • My Letters •
        </Text>
        <Text
          className="text-[11px] font-bold text-[#786964] leading-tight text-center"
          style={{ fontFamily: "ZenMaruGothic-Bold" }}
        >
          給未來的自己，一份溫暖的約定
        </Text>
        <Text
          className="text-[9.5px] text-[#A8A29E] leading-tight text-center mt-0.5"
          style={{ fontFamily: "Sora-Medium" }}
        >
          A letter to a brighter you
        </Text>
      </View>

      {/* Right Add Letter Button (+ Button) */}
      <TouchableOpacity
        onPress={onAddPress}
        className="w-10 h-10 rounded-full bg-[#F43F5E] items-center justify-center shadow-md active:opacity-90"
        style={{
          shadowColor: "#F43F5E",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default LetterHeader;
