import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ImageSourcePropType, Text, View } from "react-native";
import { Image as ExpoImage } from "expo-image";

const defaultCatLockSvg = require("../../../../assets/images/quickActions/lock-cat.svg");

interface LockedContentProps {
  catLockImage?: ImageSourcePropType;
}

export const LockedContent: React.FC<LockedContentProps> = ({ catLockImage }) => {
  const imageSource = catLockImage || defaultCatLockSvg;

  return (
    <View className="w-full items-center">
      {/* Cat & Lock Illustration Container */}
      <View className="w-full items-center justify-center py-2 relative">
        {/* Background Pink Paw Prints */}
        <View className="absolute left-4 top-2 opacity-25">
          <Ionicons name="paw" size={32} color="#F472B6" />
        </View>
        <View className="absolute right-4 top-2 opacity-25">
          <Ionicons name="paw" size={32} color="#F472B6" />
        </View>
        <View className="absolute left-6 bottom-1 opacity-25">
          <Ionicons name="paw" size={28} color="#F472B6" />
        </View>
        <View className="absolute right-6 bottom-1 opacity-25">
          <Ionicons name="paw" size={28} color="#F472B6" />
        </View>

        <ExpoImage
          source={imageSource}
          style={{ width: 160, height: 112 }}
          contentFit="contain"
        />
      </View>

      {/* Locked Headlines */}
      <Text
        className="text-base text-center mt-2 font-bold"
        style={{ fontFamily: "ZenMaruGothic-Bold", color: "#5D3327" }}
      >
        還沒有查看今日運勢喔！
      </Text>
      <Text
        className="text-sm text-center mt-1 font-bold"
        style={{ fontFamily: "ZenMaruGothic-Bold", color: "#5D3327" }}
      >
        點擊上方的貓掌，讓主子為你批准吧！
      </Text>
      <Text
        className="text-[11px] text-center mt-1"
        style={{ fontFamily: "ZenMaruGothic-Medium", color: "#5D3327", opacity: 0.7 }}
      >
        Tap the cat paw above to reveal today's fortune!
      </Text>

      {/* Bottom 4 Locked Cards Grid */}
      <View className="w-full flex-row justify-between gap-1.5 mt-4">
        {[
          { zh: "幸運色", en: "Lucky Color" },
          { zh: "幸運數字", en: "Lucky Number" },
          { zh: "幸運方向", en: "Lucky Direction" },
          { zh: "整體運勢", en: "Overall Luck" },
        ].map((item, idx) => (
          <View
            key={idx}
            className="flex-1 bg-[#FAF2E4] rounded-2xl py-3 px-1 items-center justify-center border border-[#F3E5CF]"
          >
            <View className="w-9 h-9 rounded-full bg-[#C4881A] items-center justify-center">
              <Text className="text-white font-bold text-base">?</Text>
            </View>
            <Text
              className="text-xs text-center mt-2 font-extrabold text-[#5D3327]"
              style={{ fontFamily: "ZenMaruGothic-Bold" }}
            >
              {item.zh}
            </Text>
            <Text
              className="text-[9px] text-center mt-0.5 font-bold text-[#5D3327]"
              style={{ fontFamily: "Sora-Bold" }}
            >
              {item.en}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
