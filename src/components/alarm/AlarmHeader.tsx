import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

// Require imported header & hero image assets from assets/images/alarm
const alarmHeaderImage = require("../../../assets/images/alarm/alarm-header.png");
const alarmHeroImage = require("../../../assets/images/alarm/alarm-hero.png");

interface AlarmHeaderProps {
  onBackPress?: () => void;
}

export const AlarmHeader: React.FC<AlarmHeaderProps> = ({ onBackPress }) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View className="w-full mb-4 ">
      {/* Navigation Top Bar */}
      <View className="flex-row items-center justify-between mb-4 pt-1 px-4">
        {/* Back Button */}
        <TouchableOpacity
          onPress={handleBack}
          className="w-10 h-10 rounded-full bg-white/90 border border-slate-200 items-center justify-center shadow-sm active:opacity-80"
        >
          <Ionicons name="chevron-back" size={20} color="#5D3327" />
        </TouchableOpacity>

        {/* Center Title */}
        <View className="items-center">
          <View className="flex-row items-center gap-1.5">
            <Image
              source={alarmHeaderImage}
              style={{ width: 46, height: 36 }}
              className="w-6 h-6"
              resizeMode="contain"
            />
            <Text
              className="text-[23px] font-bold text-[#5D3327]"
              style={{ fontFamily: "ZenMaruGothic-Bold" }}
            >
              貓掌開鐘
            </Text>
          </View>
          <Text
            className="text-[12px] text-[#5D3327]  ml-8 -mt-1 font-zen-bold"

          >
            Paw Alarm
          </Text>
        </View>

        {/* Right Notification Bell Button with Red Dot */}
        <TouchableOpacity className="w-10 h-10 rounded-full bg-white/90 border border-slate-200 items-center justify-center shadow-sm relative active:opacity-80">
          <Ionicons name="notifications-outline" size={19} color="#5D3327" />
          <View className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute top-2 right-2 border-2 border-white" />
        </TouchableOpacity>
      </View>

      {/* Hero Banner Section */}
      <View className="w-full flex-row items-center justify-between">
        {/* Left Hero Text */}
        <View className="flex-1 pl-4 mb-8">
          <Text
            numberOfLines={1}
            className="text-[15px] text-[#5D3327] leading-6 mb-1 font-zen-bold"
          >
            讓貓掌喚醒 更美好的你！
          </Text>
          <Text className="text-[16px] text-[#43160E] leading-6 font-zen-bold">
            Let the cat paw wake{"\n"}up a better you!
          </Text>
        </View>

        {/* Right Sleeping Cat Badge Illustration Image (Zero right margin/padding, flush to right edge) */}
        <View style={{ width: 200, height: 110, marginRight: -14 }} className="w-[200px] h-[110px] items-end justify-center -mr-3">
          <Image
            source={alarmHeroImage}
            style={{ width: 203, height: 110 }}
            className="w-[203px] h-[110px]"
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
};

export default AlarmHeader;
