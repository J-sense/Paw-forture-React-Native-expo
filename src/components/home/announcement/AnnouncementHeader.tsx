import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DayStatus } from "@/types";

export type DayStatusCategory = "lucky" | "bad_luck" | "normal";

export interface AnnouncementHeaderProps {
  isLocked: boolean;
  statusBadgeText?: string;
  dayStatus?: DayStatus | null;
  dayStatusCode?: string;
  onToggleLock: () => void;
}

export const getDayStatusCategory = (code?: string): DayStatusCategory => {
  if (!code) return "normal";
  const normalized = code.toLowerCase().trim();
  if (
    normalized.includes("lucky") ||
    normalized.includes("good") ||
    normalized.includes("bless") ||
    normalized.includes("fortune") ||
    normalized === "great"
  ) {
    return "lucky";
  }
  if (
    normalized.includes("bad") ||
    normalized.includes("danger") ||
    normalized.includes("warn") ||
    normalized.includes("unlucky") ||
    normalized.includes("evil") ||
    normalized === "ill"
  ) {
    return "bad_luck";
  }
  return "normal";
};

const STATUS_THEMES: Record<
  DayStatusCategory,
  {
    headerBg: string;
    borderBottomColor: string;
    icon: string;
    titleColor: string;
    subtitleColor: string;
    badgeBorder: string;
    badgeTextColor: string;
    badgeIcon: keyof typeof Ionicons.glyphMap;
    badgeIconColor: string;
    defaultText: string;
  }
> = {
  lucky: {
    headerBg: "#FEF3C7", // Warm golden amber
    borderBottomColor: "#FDE68A",
    icon: "✨",
    titleColor: "#92400E",
    subtitleColor: "#B45309",
    badgeBorder: "#FCD34D",
    badgeTextColor: "#B45309",
    badgeIcon: "sparkles",
    badgeIconColor: "#D97706",
    defaultText: "大吉 Lucky",
  },
  bad_luck: {
    headerBg: "#FEE2E2", // Soft cautionary rose/coral
    borderBottomColor: "#FECACA",
    icon: "⚠️",
    titleColor: "#991B1B",
    subtitleColor: "#B91C1C",
    badgeBorder: "#FCA5A5",
    badgeTextColor: "#DC2626",
    badgeIcon: "alert-circle",
    badgeIconColor: "#DC2626",
    defaultText: "凶 Bad Luck",
  },
  normal: {
    headerBg: "#E5F3E6", // Gentle sage green
    borderBottomColor: "#D1E7D3",
    icon: "🗓️",
    titleColor: "#3A5A40",
    subtitleColor: "#5E7A62",
    badgeBorder: "#C8E6C9",
    badgeTextColor: "#3A5A40",
    badgeIcon: "leaf",
    badgeIconColor: "#3A5A40",
    defaultText: "平 Normal",
  },
};

export const AnnouncementHeader: React.FC<AnnouncementHeaderProps> = ({
  isLocked,
  statusBadgeText,
  dayStatus,
  dayStatusCode,
  onToggleLock,
}) => {
  const activeCode = dayStatusCode || dayStatus?.code;
  const category = getDayStatusCategory(activeCode);
  const theme = STATUS_THEMES[category];

  // Resolve display text for unlocked badge
  const resolvedBadgeText =
    statusBadgeText ||
    (dayStatus
      ? `${dayStatus.name_zh || dayStatus.zh || ""} ${
          dayStatus.name_en || dayStatus.en || dayStatus.status || ""
        }`.trim()
      : undefined) ||
    theme.defaultText;

  return (
    <View
      className="px-4 py-3 flex-row items-center justify-between"
      style={{
        backgroundColor: theme.headerBg,
        borderBottomWidth: 1,
        borderBottomColor: theme.borderBottomColor,
      }}
    >
      {/* Left Title */}
      <View className="flex-row items-center gap-2">
        <Text className="text-base">{theme.icon}</Text>
        <Text
          className="text-sm font-bold"
          style={{ fontFamily: "ZenMaruGothic-Bold", color: theme.titleColor }}
        >
          今日宜忌
        </Text>
        <Text
          className="text-xs ml-1"
          style={{
            fontFamily: "ZenMaruGothic-Medium",
            color: theme.subtitleColor,
          }}
        >
          Today's Almanac
        </Text>
      </View>

      {/* Right Status Badge */}
      <Pressable
        onPress={onToggleLock}
        className="bg-white px-3 py-1 rounded-full flex-row items-center gap-1 shadow-sm active:opacity-80"
        style={{
          borderWidth: 1,
          borderColor: isLocked ? "#FECDD3" : theme.badgeBorder,
        }}
      >
        {isLocked ? (
          <>
            <Text
              className="text-xs font-bold"
              style={{ fontFamily: "ZenMaruGothic-Bold", color: "#F43F5E" }}
            >
              未解鎖 Locked
            </Text>
            <Ionicons name="lock-closed" size={11} color="#F43F5E" />
          </>
        ) : (
          <>
            <Text
              className="text-xs font-bold"
              style={{
                fontFamily: "ZenMaruGothic-Bold",
                color: theme.badgeTextColor,
              }}
            >
              {resolvedBadgeText}
            </Text>
            <Ionicons
              name={theme.badgeIcon}
              size={11}
              color={theme.badgeIconColor}
            />
          </>
        )}
      </Pressable>
    </View>
  );
};

