import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  Text,
  View
} from "react-native";

interface QuickActionsProps {
  onCheckFortune?: () => void;
  onWriteLetter?: () => void;
  onCatTarot?: () => void;
}

interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  middleIcon?: any;
  subText1: string;
  subText2: string;
  buttonText: string;
  buttonSubtext: string;
  buttonBgColor: string;
  chevronColor: string;
  shadowColor: string;
  bgImage: any;
  onPress?: () => void;
}

const pinkCardBg = require("../../../assets/images/quickActions/Rectangle 10.png");
const pinkMiddleIcon = require("../../../assets/images/quickActions/Rectangle-middle.png");
const blueCardBg = require("../../../assets/images/quickActions/blue.png");
const blueMiddleIcon = require("../../../assets/images/quickActions/blue-middle.png");
const yellowCardBg = require("../../../assets/images/quickActions/yellow.png");
const yellowMiddleIcon = require("../../../assets/images/quickActions/yellow-middle.png");

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCheckFortune,
  onWriteLetter,
  onCatTarot,
}) => {
  const actions: QuickActionItem[] = [
    {
      id: "pink",
      title: "貓掌開啟好運",
      subtitle: "Open Your Luck",
      bgImage: pinkCardBg,
      middleIcon: pinkMiddleIcon,
      subText1: "長按貓掌開啟好運",
      subText2: "或快速點擊3次",
      buttonText: "立即測運勢",
      buttonSubtext: "Check Your Fortune Now",
      buttonBgColor: "bg-[#DF4587]",
      chevronColor: "#DF4587",
      shadowColor: "#DF4587",
      onPress: onCheckFortune,
    },
    {
      id: "blue",
      title: "寫給未來的你",
      subtitle: "A Letter to Future You",
      bgImage: blueCardBg,
      middleIcon: blueMiddleIcon,
      subText1: "用貓掌開啟信件",
      subText2: "寫給未來的自己",
      buttonText: "開始寫信",
      buttonSubtext: "Start Writing a Letter",
      buttonBgColor: "bg-[#1498DB]",
      chevronColor: "#1498DB",
      shadowColor: "#1498DB",
      onPress: onWriteLetter,
    },
    {
      id: "yellow",
      title: "貓咪塔羅",
      subtitle: "Cat Tarot",
      bgImage: yellowCardBg,
      middleIcon: yellowMiddleIcon,
      subText1: "讓貓咪為你指引方向",
      subText2: "Let cats guide your path",
      buttonText: "立即查看",
      buttonSubtext: "Go Premium / Start",
      buttonBgColor: "bg-[#C08213]",
      chevronColor: "#C08213",
      shadowColor: "#C08213",
      onPress: onCatTarot,
    },
  ];

  return (
    <View className="w-full my-2.5">
      <View className="flex-row justify-between items-center gap-2">
        {actions.map((item) => (
          <Pressable
            key={item.id}
            onPress={item.onPress}
            className="flex-1 h-[169px] rounded-[18px] overflow-hidden relative active:opacity-95"
          >
            <ImageBackground
              source={item.bgImage}
              className="w-full h-full p-2 justify-between items-center"
              resizeMode="stretch"
            >
              {/* Top Title */}
              <View className="items-center justify-center pt-2">
                <Text
                  className="text-center font-zen-bold text-[#5D3327] text-[10px] leading-3.5"
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text
                  className="text-center text-[#5D3327] font-sora-medium text-[7px] leading-3"
                  numberOfLines={1}
                >
                  {item.subtitle}
                </Text>
              </View>

              {/* Middle Image Icon if available */}
              {item.middleIcon && (
                <Image
                  source={item.middleIcon}
                  className="w-[60px] h-[48px] absolute top-12"
                  resizeMode="contain"
                />
              )}

              {/* Sub text above button */}
              <View className="items-center z-10 mt-14">
                <Text
                  className="text-[7px] font-bold text-center text-[#5D3327] leading-tight"
                  style={{ fontFamily: "ZenMaruGothic-Bold" }}
                  numberOfLines={1}
                >
                  {item.subText1}
                </Text>
                <Text
                  className="text-[6px] text-center text-[#5D3327]/80 leading-tight mt-0.5"
                  style={{ fontFamily: "ZenMaruGothic-Medium" }}
                  numberOfLines={1}
                >
                  {item.subText2}
                </Text>
              </View>

              {/* Action Pill Button */}
              <View
                className={`w-full ${item.buttonBgColor} px-1.5 py-[3px] rounded-[100px] flex-row items-center justify-between shadow-sm`}
              >
                <View className="flex-1 mr-0.5 justify-start items-start">
                  <Text
                    className="self-stretch text-white text-[7.5px] font-bold leading-[9px]"
                    style={{ fontFamily: "ZenMaruGothic-Bold" }}
                    numberOfLines={1}
                  >
                    {item.buttonText}
                  </Text>
                  <Text
                    className="w-full text-left text-gray-200 text-[4.5px] font-medium leading-[8px]"
                    style={{ fontFamily: "ZenMaruGothic-Medium" }}
                    numberOfLines={1}
                  >
                    {item.buttonSubtext}
                  </Text>
                </View>
                <View className="w-3.5 h-3.5 rounded-full bg-white items-center justify-center">
                  <Ionicons
                    name="chevron-forward"
                    size={8}
                    color={item.chevronColor}
                  />
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default QuickActions;
