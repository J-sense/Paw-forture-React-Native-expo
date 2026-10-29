import { CustomToggleSwitch } from "@/components/ui/CustomToggleSwitch";
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

const morningSvg = require("../../../assets/images/alarm/morning.svg");
const lunchSvg = require("../../../assets/images/alarm/lunch.svg");
const takeBreakSvg = require("../../../assets/images/alarm/take-break.svg");
const relaxTimeSvg = require("../../../assets/images/alarm/relex-time.svg");
const nightTimeSvg = require("../../../assets/images/alarm/night-time.svg");

export interface AlarmItem {
  id: string;
  time: string;
  period: "AM" | "PM";
  titleZh: string;
  titleEn: string;
  repeat: string;
  iconEmoji?: string;
  iconType?: string;
  bgColor: string;
  borderColor: string;
  enabled: boolean;
  /** Selected repeat weekdays ("Mon".."Sun"). Empty array = single (one-time) alarm. */
  days?: string[];
  note?: string;
}

interface AlarmCardProps {
  alarm: AlarmItem;
  onToggle: (id: string, value: boolean) => void;
  onDelete?: (id: string) => void;
}

/**
 * Gets the corresponding SVG image asset based on alarm time range:
 * - 05:00 - 10:59 AM (5-10): morning.svg
 * - 11:00 AM - 01:59 PM (11-13): lunch.svg
 * - 02:00 PM - 04:59 PM (14-16): take-break.svg
 * - 05:00 PM - 08:59 PM (17-20): relax-time.svg
 * - 09:00 PM - 04:59 AM (21-4): night-time.svg
 */
export function getAlarmSvg(timeStr: string, period: "AM" | "PM", iconType?: string) {
  if (iconType) {
    switch (iconType) {
      case "morning":
        return morningSvg;
      case "lunch":
        return lunchSvg;
      case "take-break":
      case "takeBreak":
        return takeBreakSvg;
      case "relax-time":
      case "relaxTime":
      case "relex-time":
        return relaxTimeSvg;
      case "night-time":
      case "nightTime":
        return nightTimeSvg;
    }
  }

  const parts = timeStr.split(":");
  let hour = parseInt(parts[0], 10);
  if (isNaN(hour)) hour = 7;

  if (period === "PM" && hour < 12) {
    hour += 12;
  } else if (period === "AM" && hour === 12) {
    hour = 0;
  }

  if (hour >= 5 && hour <= 10) {
    return morningSvg;
  } else if (hour >= 11 && hour <= 13) {
    return lunchSvg;
  } else if (hour >= 14 && hour <= 16) {
    return takeBreakSvg;
  } else if (hour >= 17 && hour <= 20) {
    return relaxTimeSvg;
  } else {
    return nightTimeSvg;
  }
}

export const AlarmCard: React.FC<AlarmCardProps> = ({
  alarm,
  onToggle,
  onDelete,
}) => {
  const alarmSvgSource = getAlarmSvg(alarm.time, alarm.period, alarm.iconType);

  return (
    <View
      className={`w-full p-3.5 rounded-2xl border mb-3 flex-row items-center justify-between relative ${
        alarm.enabled ? "bg-[#FFFDF9] border-[#F3E8D5]" : "bg-slate-50/80 border-slate-200"
      }`}
      style={{
        shadowColor: "#C6AF99",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Top Corner Delete Button */}
      {onDelete && (
        <TouchableOpacity
          onPress={() => onDelete(alarm.id)}
          className="absolute top-2 right-2.5 w-6 h-6 rounded-full bg-red-50/90 items-center justify-center border border-red-200/80 active:opacity-60 z-10"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={12} color="#E05353" />
        </TouchableOpacity>
      )}

      {/* Left Alarm Image (61.480445861816406px x 61.480445861816406px) */}
      <View className="w-[61.5px] h-[61.5px] rounded-2xl overflow-hidden items-center justify-center mr-3 bg-amber-50/50">
        <ExpoImage
          source={alarmSvgSource}
          style={{ width: 61.480445861816406, height: 61.480445861816406 }}
          contentFit="cover"
        />
      </View>

      {/* Center Details */}
      <View className="flex-1 pr-2">
        <View className="flex-row items-baseline gap-1">
          <Text
            className={`text-xl font-extrabold ${
              alarm.enabled ? "text-[#5D3327]" : "text-slate-400"
            }`}
            style={{ fontFamily: "Sora-Bold" }}
          >
            {alarm.time}
          </Text>
          <Text
            className={`text-xs font-bold ${
              alarm.enabled ? "text-[#5D3327]" : "text-slate-400"
            }`}
            style={{ fontFamily: "Sora-Bold" }}
          >
            {alarm.period}
          </Text>
        </View>

        {/* Title Chinese */}
        <Text
          className={`text-xs font-bold mt-0.5 ${
            alarm.enabled ? "text-[#5D3327]" : "text-slate-400"
          }`}
          style={{ fontFamily: "ZenMaruGothic-Bold" }}
        >
          {alarm.titleZh}
        </Text>

        {/* Title English */}
        <Text
          className={`text-[9.5px] ${
            alarm.enabled ? "text-[#A89F91]" : "text-slate-400"
          }`}
          style={{ fontFamily: "Sora-Medium" }}
        >
          {alarm.titleEn}
        </Text>

        {/* Repeat Days */}
        <Text
          className={`text-[8.5px] mt-0.5 ${
            alarm.enabled ? "text-[#D48B16]" : "text-slate-400"
          }`}
          style={{ fontFamily: "ZenMaruGothic-Medium" }}
        >
          {alarm.repeat}
        </Text>
      </View>

      {/* Right Custom Toggle Switch */}
      <View className="items-center justify-center pt-2">
        <CustomToggleSwitch
          value={alarm.enabled}
          onValueChange={(val) => onToggle(alarm.id, val)}
        />
      </View>
    </View>
  );
};

export default AlarmCard;
