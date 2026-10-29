import { useCheckInToday } from "@/hooks/useHome";
import { toast } from "burnt";
import React, { useRef, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

interface HeroCardProps {
  topRightImage?: ImageSourcePropType;
  mainCardImage?: ImageSourcePropType;
  bottomRightImage?: ImageSourcePropType;
  isUnlocked?: boolean;
}

const defaultTopRight = require("../../../assets/images/hero-top-right.png");
const defaultMainCard = require("../../../assets/images/hero-mainCardImage.png");
const defaultBottomRight = require("../../../assets/images/hero-bottom-right.png");

export const HeroCard: React.FC<HeroCardProps> = ({
  topRightImage = defaultTopRight,
  mainCardImage = defaultMainCard,
  bottomRightImage = defaultBottomRight,
  isUnlocked,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const { mutate: checkInToday, isPending } = useCheckInToday();
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Responsive dimensions based on screen width
  const isSmallScreen = windowWidth < 375;
  const mainCardWidth = Math.min(windowWidth * 0.58, 230);
  const mainCardHeight = mainCardWidth * (44 / 60);

  const handleMainCardPress = () => {
    if (isUnlocked) {
      toast({
        title: "Already Checked In",
        message: "今日已經完成簽到！",
        preset: "done",
      });
      return;
    }

    if (isPending) return;

    const nextCount = clickCount + 1;
    console.log(`🐾 Paw tapped: ${nextCount}/3`);

    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
    }

    if (nextCount >= 3) {
      setClickCount(0);
      console.log("🚀 3 taps reached! Calling POST /daily-check-in/today/...");

      checkInToday(undefined, {
        onSuccess: (res: any) => {
          console.log("✅ Check-in Success:", res);
          toast({
            title: res?.message_eng || "Check-in Successful",
            message: res?.message_chinese || "今日簽到成功！",
            preset: "done",
          });
        },
        onError: (error: any) => {
          if (error?.response?.status === 401) return;

          toast({
            title:
              error?.response?.data?.message_eng ||
              error?.message ||
              "Check-in Failed",
            message: error?.response?.data?.message_chinese,
            preset: "error",
          });
        },
      });
    } else {
      setClickCount(nextCount);
      // Reset if next tap doesn't happen within 2.5 seconds
      clickTimer.current = setTimeout(() => {
        setClickCount(0);
      }, 2500);
    }
  };

  const remainingTaps = 3 - clickCount;

  return (
    <View
      className="w-full relative rounded-[20px] border border-orange-100/80 overflow-hidden my-2.5 p-3.5"
      style={{
        backgroundColor: "#FFF9F0",
        minHeight: isSmallScreen ? 285 : 305,
        shadowColor: "#C6AF99",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
        elevation: 3,
      }}
    >
      {/* Top Right Sparkle */}
      <View className="absolute top-3.5 right-3.5 z-10">
        <Text className="text-amber-400 text-sm font-normal">✦</Text>
      </View>

      {/* Top Header & Text Content */}
      <View className="flex-row justify-between items-start z-10">
        <View className="flex-1 pr-2 pt-0.5 gap-1">
          {/* Badge */}
          <View
            className="self-start px-2 py-0.5 rounded-full border flex-row items-center"
            style={{
              backgroundColor: "#FDF0EC",
              borderColor: "#FCDCCE",
            }}
          >
            <Text
              className="text-[9px] tracking-tight uppercase"
              style={{ fontFamily: "ZenMaruGothic-Bold", color: "#FD507F" }}
            >
              TODAY'S DESTINY
            </Text>
          </View>

          {/* Chinese Headline */}
          <View className="pt-0.5">
            <Text
              className="text-base leading-5 text-[#5D3327]"
              style={{ fontFamily: "ZenMaruGothic-Bold", color: "#5D3327" }}
            >
              先讓主子批准，{"\n"}今日命運才會開口。
            </Text>
          </View>

          {/* English Subtitle */}
          <View className="pb-1">
            <Text
              className="text-[10px] leading-3.5 text-[#5D3327]"
              style={{ fontFamily: "ZenMaruGothic-Bold", color: "#5D3327", opacity: 0.8 }}
            >
              Let your master approve first, then{"\n"}today's destiny will speak.
            </Text>
          </View>
        </View>

        {/* Top Right Image Illustration */}
        {topRightImage && (
          <Image
            source={topRightImage}
            style={{
              width: isSmallScreen ? 120 : 138,
              height: isSmallScreen ? 100 : 118,
            }}
            resizeMode="contain"
          />
        )}
      </View>

      {/* Main Bottom Left Illustration Card (Clickable - 3 taps trigger POST /daily-check-in/today/) */}
      {mainCardImage && (
        <Pressable
          onPress={handleMainCardPress}
          className="absolute left-3 bottom-2 z-20 active:opacity-90 active:scale-95"
        >
          {/* Remaining Taps Tooltip Badge */}
          {clickCount > 0 && !isUnlocked && (
            <View
              className="absolute -top-7 left-4 z-30 px-2.5 py-0.5 rounded-full flex-row items-center"
              style={{
                backgroundColor: "#F43F5E",
                shadowColor: "#F43F5E",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.35,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <Text
                className="text-[9px] font-bold text-white text-center"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                🐾 還需點擊 {remainingTaps} 次 ({remainingTaps} more)
              </Text>
            </View>
          )}

          <Image
            source={mainCardImage}
            style={{ width: mainCardWidth, height: mainCardHeight }}
            className="-rotate-[2.72deg]"
            resizeMode="contain"
          />
        </Pressable>
      )}

      {/* Bottom Right Illustration Stamp (Positioned relative to bottom-right, never overflow) */}
      {bottomRightImage && (
        <Image
          source={bottomRightImage}
          style={{
            width: isSmallScreen ? 75 : 90,
            height: isSmallScreen ? 88 : 105,
          }}
          className="absolute right-2.5 bottom-2"
          resizeMode="contain"
        />
      )}
    </View>
  );
};

export default HeroCard;
