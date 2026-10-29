import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LetterTabType } from "./LetterItem";

interface LetterTabFilterProps {
  activeTab: LetterTabType;
  onTabChange: (tab: LetterTabType) => void;
}

export const LetterTabFilter: React.FC<LetterTabFilterProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: {
    type: LetterTabType;
    labelZh: string;
    labelEn: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    { type: "all", labelZh: "全部", labelEn: "All", icon: "mail" },
    { type: "pending", labelZh: "未開啟", labelEn: "Unopened", icon: "mail-unread-outline" },
    { type: "opened", labelZh: "已開啟", labelEn: "Opened", icon: "mail-open-outline" },
  ];

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.type;
        return (
          <TouchableOpacity
            key={tab.type}
            onPress={() => onTabChange(tab.type)}
            activeOpacity={0.8}
            style={[styles.tabItem, isActive && styles.activeTabItem]}
          >
            <Ionicons
              name={tab.icon}
              size={14}
              color={isActive ? "#FFFFFF" : "#8C7B75"}
            />
            <Text style={[styles.labelZh, isActive && styles.activeLabelZh]}>
              {tab.labelZh}
            </Text>
            <Text style={[styles.labelEn, isActive && styles.activeLabelEn]}>
              {tab.labelEn}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 9999,
    padding: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#F3E8D5",
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 9999,
    backgroundColor: "transparent",
  },
  activeTabItem: {
    backgroundColor: "#F43F5E",
    shadowColor: "#F43F5E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  labelZh: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#8C7B75",
    fontFamily: "ZenMaruGothic-Medium",
  },
  activeLabelZh: {
    color: "#FFFFFF",
    fontFamily: "ZenMaruGothic-Bold",
  },
  labelEn: {
    fontSize: 9,
    color: "#A89F91",
    fontFamily: "Sora-Medium",
  },
  activeLabelEn: {
    color: "rgba(255, 255, 255, 0.9)",
  },
});

export default LetterTabFilter;
