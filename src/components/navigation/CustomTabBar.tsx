import React from "react";
import { View, Text, Pressable } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Require imported SVG icons from assets/images/quickActions
const homeSvg = require("../../../assets/images/quickActions/home-tab.svg");
const calendarSvg = require("../../../assets/images/quickActions/calenderTab.svg");
const middleTabSvg = require("../../../assets/images/quickActions/middleTab.svg");
const catTarotSvg = require("../../../assets/images/quickActions/catTarot-tab.svg");
const myLetterSvg = require("../../../assets/images/quickActions/myLetter-tab.svg");

export interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

// Side tabs configuration (Home, Calendar, Cat Tarot, My Letter)
interface TabItemConfig {
  routeName: string;
  labelZh: string;
  labelEn: string;
  svg?: any;
  iconActive?: keyof typeof Ionicons.glyphMap;
  iconInactive?: keyof typeof Ionicons.glyphMap;
}

const TAB_CONFIGS: TabItemConfig[] = [
  {
    routeName: "index",
    labelZh: "首頁",
    labelEn: "Home",
    svg: homeSvg,
  },
  {
    routeName: "explore",
    labelZh: "日曆",
    labelEn: "Calendar",
    svg: calendarSvg,
  },
  {
    routeName: "notifications",
    labelZh: "貓咪塔羅",
    labelEn: "Cat Tarot",
    svg: catTarotSvg,
  },
  {
    routeName: "profile",
    labelZh: "我的信件",
    labelEn: "My Letter",
    svg: myLetterSvg,
  },
];

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 12);

  // Split side tabs around the center paw button
  const leftTabs = TAB_CONFIGS.slice(0, 2);
  const rightTabs = TAB_CONFIGS.slice(2, 4);

  // Check if center alarm Paw tab route is active
  const alarmIndex = state.routes.findIndex((r: { name: string }) => r.name === "alarm");
  const isAlarmFocused = state.index === alarmIndex;

  // Render side tab item
  const renderTab = (tabConfig: TabItemConfig) => {
    const routeIndex = state.routes.findIndex((r: { name: string }) => r.name === tabConfig.routeName);
    const isFocused = state.index === routeIndex;

    const onPress = () => {
      if (routeIndex !== -1) {
        const route = state.routes[routeIndex];
        const event = navigation.emit({
          type: "tabPress",
          target: route.key,
          canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(route.name);
        }
      }
    };

    const textColorClass = isFocused ? "text-yellow-600 font-extrabold" : "text-slate-600 font-bold";
    const iconColor = isFocused ? "#D48B16" : "#475569";

    return (
      <Pressable
        key={tabConfig.routeName}
        onPress={onPress}
        className="flex-1 items-center justify-center py-0.5 active:opacity-75"
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
      >
        {/* Tab Icon (Renders SVG if available, or Ionicons fallback) */}
        <View className="size-5 items-center justify-center">
          {tabConfig.svg ? (
            <ExpoImage
              source={tabConfig.svg}
              style={{ width: 20, height: 20 }}
              contentFit="contain"
              tintColor={iconColor}
            />
          ) : (
            <Ionicons
              name={isFocused ? tabConfig.iconActive! : tabConfig.iconInactive!}
              size={19}
              color={iconColor}
            />
          )}
        </View>

        {/* Chinese Label */}
        <Text className={`text-[9px] text-center leading-3 ${textColorClass}`}>
          {tabConfig.labelZh}
        </Text>

        {/* English Label */}
        <Text className={`text-[6.5px] font-normal text-center leading-[9.75px] ${textColorClass}`}>
          {tabConfig.labelEn}
        </Text>
      </Pressable>
    );
  };

  // Center Paw Button Handler
  const handleCenterButtonPress = () => {
    if (alarmIndex !== -1) {
      const route = state.routes[alarmIndex];
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isAlarmFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    } else {
      navigation.navigate("alarm");
    }
  };

  return (
    <View
      style={{ bottom: bottomInset }}
      className="absolute left-4 right-4 items-center justify-center z-50"
    >
      {/* Main Floating Outer Card */}
      <View className="w-full h-16 bg-white/95 rounded-3xl border border-white/80 flex-row items-center justify-between px-1 shadow-[0px_8px_30px_0px_rgba(100,140,180,0.30)]">
        {/* Left 2 Tabs (Home, Calendar) */}
        <View className="flex-1 flex-row items-center justify-around">
          {leftTabs.map(renderTab)}
        </View>

        {/* Center Spacer for Floating Button */}
        <View className="size-14" />

        {/* Right 2 Tabs (Cat Tarot, My Letter) */}
        <View className="flex-1 flex-row items-center justify-around">
          {rightTabs.map(renderTab)}
        </View>
      </View>

      {/* Floating Center Cat Paw Button (Renders middleTab.svg natively with expo-image) */}
      <Pressable
        onPress={handleCenterButtonPress}
        className={`absolute -top-4 size-14 justify-center items-center z-50 rounded-full border-4 border-white bg-yellow-600 shadow-[0px_8px_16px_0px_rgba(204,143,32,0.45)] active:opacity-90 ${
          isAlarmFocused ? "scale-105" : ""
        }`}
        accessibilityRole="button"
        accessibilityLabel="Cat Paw Alarm Tab"
        accessibilityState={isAlarmFocused ? { selected: true } : {}}
      >
        <ExpoImage
          source={middleTabSvg}
          style={{ width: 32, height: 32 }}
          contentFit="contain"
        />
      </Pressable>
    </View>
  );
};

export default CustomTabBar;
