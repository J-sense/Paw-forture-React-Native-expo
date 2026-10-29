import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface UnlockedContentProps {
  dateDay?: string;
  dateMonthYear?: string;
  dateWeekday?: string;
  goodForText?: string;
  avoidText?: string;
  goodForEnglish?: string;
  avoidEnglish?: string;
  luckyColorName?: string;
  luckyColorHex?: string;
  luckyNumber?: string | number;
  luckyDirection?: string;
}

const todayDate = new Date();
const DEFAULT_DAY = String(todayDate.getDate());
const DEFAULT_MONTH_YEAR = todayDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
const DEFAULT_WEEKDAY = todayDate.toLocaleDateString("zh-TW", { weekday: "long" });

export const UnlockedContent: React.FC<UnlockedContentProps> = ({
  dateDay = DEFAULT_DAY,
  dateMonthYear = DEFAULT_MONTH_YEAR,
  dateWeekday = DEFAULT_WEEKDAY,
  goodForText = "努力、微笑、學習",
  avoidText = "焦慮、比較、熬夜",
  goodForEnglish = "Good for: Effort, Smiles, Learning",
  avoidEnglish = "Avoid: Anxiety, Comparison, Staying up late",
  luckyColorName = "粉色 Pink",
  luckyColorHex = "#FF4D8D",
  luckyNumber = "7",
  luckyDirection = "東南 SE",
}) => {
  return (
    <View className="w-full">
      {/* Date Card & Good For / Avoid Details */}
      <View className="w-full flex-row items-start justify-between py-1 px-0.5">
        {/* Left Date Card (Fixed ratio, shrink-0) */}
        <View
          className="w-[84px] h-[84px] shrink-0 bg-[#DCEDC8] rounded-2xl items-center justify-center border border-[#C8E6C9] overflow-hidden"
          style={{
            shadowColor: "#2E5B28",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          {/* Calendar header strip with binding dots */}
          <View className="absolute top-0 left-0 right-0 h-3 bg-[#C5E1A5] border-b border-[#AED581]/70 flex-row items-center justify-center gap-4">
            <View className="w-1.5 h-1.5 rounded-full bg-[#7CB342]/70" />
            <View className="w-1.5 h-1.5 rounded-full bg-[#7CB342]/70" />
          </View>

          {/* Top highlight line */}
          <View className="absolute top-3 left-2 right-2 h-px bg-white/70" />

          <View className="items-center justify-center pt-2.5">
            <Text
              className="text-2xl font-bold leading-7"
              style={{ fontFamily: "ZenMaruGothic-Bold", color: "#2E5B28" }}
            >
              {dateDay}
            </Text>

            {/* Soft divider under the day number */}
            <View className="w-8 h-px bg-[#2E5B28]/15 my-0.5" />

            <Text
              className="text-[10px] font-bold mt-0.5"
              style={{ fontFamily: "ZenMaruGothic-Bold", color: "#3A6A34" }}
              numberOfLines={1}
            >
              {dateMonthYear}
            </Text>
            <Text
              className="text-[9px] mt-0.5"
              style={{ fontFamily: "ZenMaruGothic-Medium", color: "#558B2F" }}
              numberOfLines={1}
            >
              {dateWeekday}
            </Text>
          </View>
        </View>

        {/* Right Good For / Avoid Rows (Flexible, wrapping allowed) */}
        <View className="flex-1 ml-3 justify-center">
          {/* 宜 (Good For) */}
          <View className="flex-row items-start mb-1.5">
            <View
              className="w-5 h-5 bg-[#FEF0C7] rounded-md border border-[#FDE272] items-center justify-center overflow-hidden"
              style={{
                shadowColor: "#7A5E0B",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 1.5,
                elevation: 1,
              }}
            >
              <View className="absolute top-0 left-1 right-1 h-px bg-white/80" />
              <Text
                className="text-[10px] font-bold leading-3"
                style={{ fontFamily: "ZenMaruGothic-Bold", color: "#7A5E0B" }}
              >
                宜
              </Text>
            </View>
            <Text
              className="text-sm font-bold ml-2 flex-1 leading-5"
              style={{ fontFamily: "ZenMaruGothic-Bold", color: "#5D3327" }}
            >
              {goodForText}
            </Text>
          </View>

          {/* 忌 (Avoid) */}
          <View className="flex-row items-start mb-1.5">
            <View
              className="w-5 h-5 bg-[#FEE4E2] rounded-md border border-[#FECDCA] items-center justify-center overflow-hidden"
              style={{
                shadowColor: "#912018",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 1.5,
                elevation: 1,
              }}
            >
              <View className="absolute top-0 left-1 right-1 h-px bg-white/80" />
              <Text
                className="text-[10px] font-bold leading-3"
                style={{ fontFamily: "ZenMaruGothic-Bold", color: "#912018" }}
              >
                忌
              </Text>
            </View>
            <Text
              className="text-sm font-bold ml-2 flex-1 leading-5"
              style={{ fontFamily: "ZenMaruGothic-Bold", color: "#5D3327" }}
            >
              {avoidText}
            </Text>
          </View>

          {/* English Descriptions */}
          {goodForEnglish ? (
            <Text
              className="text-[10px] leading-3.5 border-l-2 border-[#FDE272] pl-2"
              style={{ fontFamily: "ZenMaruGothic-Medium", color: "#5D3327", opacity: 0.8 }}
            >
              {goodForEnglish}
            </Text>
          ) : null}
          {avoidEnglish ? (
            <Text
              className="text-[10px] leading-3.5 mt-1 border-l-2 border-[#FECDCA] pl-2"
              style={{ fontFamily: "ZenMaruGothic-Medium", color: "#5D3327", opacity: 0.8 }}
            >
              {avoidEnglish}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Bottom 3 Revealed Attributes Row (Clean, responsive centered items) */}
      <View
        className="w-full bg-[#F9F3EA] rounded-2xl px-1 py-3 flex-row justify-between items-center border border-amber-100 mt-3"
        style={{
          shadowColor: "#B66B20",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 3,
          elevation: 1,
        }}
      >
        {/* Top highlight line */}
        <View className="absolute top-0 left-5 right-5 h-px bg-white/90" />

        {/* Column 1: Lucky Color */}
        <View className="flex-1 items-center justify-center px-1">
          <View
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm mb-1.5"
            style={{ backgroundColor: luckyColorHex }}
          />
          <Text
            className="text-[10px] font-bold text-center tracking-wide"
            style={{ fontFamily: "ZenMaruGothic-Bold", color: "#5D3327", opacity: 0.7 }}
          >
            幸運色 Color
          </Text>
          <Text
            className="text-[13px] font-extrabold text-center mt-0.5"
            style={{ fontFamily: "ZenMaruGothic-Bold", color: "#5D3327" }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {luckyColorName}
          </Text>
        </View>

        {/* Divider */}
        <View className="w-px h-10 bg-amber-200/60" />

        {/* Column 2: Lucky Number */}
        <View className="flex-1 items-center justify-center px-1">
          <View className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 items-center justify-center mb-1.5">
            <Text className="text-base leading-5">🍀</Text>
          </View>
          <Text
            className="text-[10px] font-bold text-center tracking-wide"
            style={{ fontFamily: "ZenMaruGothic-Bold", color: "#5D3327", opacity: 0.7 }}
          >
            幸運數字 No.
          </Text>
          <Text
            className="text-[13px] font-extrabold text-center mt-0.5"
            style={{ fontFamily: "ZenMaruGothic-Bold", color: "#5D3327" }}
            numberOfLines={1}
          >
            {luckyNumber}
          </Text>
        </View>

        {/* Divider */}
        <View className="w-px h-10 bg-amber-200/60" />

        {/* Column 3: Lucky Direction */}
        <View className="flex-1 items-center justify-center px-1">
          <View className="w-8 h-8 rounded-full bg-sky-50 border border-sky-100 items-center justify-center mb-1.5">
            <Ionicons name="compass" size={18} color="#4A6572" />
          </View>
          <Text
            className="text-[10px] font-bold text-center tracking-wide"
            style={{ fontFamily: "ZenMaruGothic-Bold", color: "#5D3327", opacity: 0.7 }}
          >
            幸運方向 Dir.
          </Text>
          <Text
            className="text-[13px] font-extrabold text-center mt-0.5"
            style={{ fontFamily: "ZenMaruGothic-Bold", color: "#5D3327" }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {luckyDirection}
          </Text>
        </View>
      </View>
    </View>
  );
};
