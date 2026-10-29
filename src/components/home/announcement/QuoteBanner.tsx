import React from "react";
import { View, Text, Image, ImageSourcePropType } from "react-native";

interface QuoteBannerProps {
  plantLeftImage?: ImageSourcePropType;
  plantRightImage?: ImageSourcePropType;
  chineseQuote?: string;
  englishQuote?: string;
}

export const QuoteBanner: React.FC<QuoteBannerProps> = ({
  plantLeftImage,
  plantRightImage,
  chineseQuote = "平凡的一天，也能成就很不平凡的你。",
  englishQuote = "An ordinary day can still make an extraordinary you.",
}) => {
  return (
    <View className="w-full bg-[#F0F7FF] border border-blue-100 rounded-2xl p-3 my-4 flex-row items-center justify-between">
      {plantLeftImage ? (
        <Image source={plantLeftImage} className="w-6 h-6" resizeMode="contain" />
      ) : (
        <Text className="text-xl">🪴</Text>
      )}

      <View className="flex-1 px-2 items-center">
        <Text
          className="text-xs text-center font-bold"
          style={{ fontFamily: "ZenMaruGothic-Bold", color: "#1E3A8A" }}
        >
          {chineseQuote}
        </Text>
        <Text
          className="text-[10px] text-center mt-0.5"
          style={{ fontFamily: "ZenMaruGothic-Medium", color: "#1D4ED8", opacity: 0.8 }}
        >
          {englishQuote}
        </Text>
      </View>

      {plantRightImage ? (
        <Image source={plantRightImage} className="w-6 h-6" resizeMode="contain" />
      ) : (
        <Text className="text-xl">🪴</Text>
      )}
    </View>
  );
};
