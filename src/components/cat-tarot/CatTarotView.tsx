import { useDrawTarotCard, useTodayTarot } from "@/hooks/useTarot";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tarotCardImg = require("../../../assets/images/tarotCard.png");
const catTarotMiddle = require("../../../assets/images/cat-tarot/cat-tarot-middle.png");
const alarmHeaderPng = require("../../../assets/images/alarm/alarm-header.png");

interface CatTarotViewProps {
  onStartReading?: () => void;
  onHistoryPress?: () => void;
  onCardSelect?: (cardNumber: number) => void;
}

export const CatTarotView: React.FC<CatTarotViewProps> = ({
  onStartReading,
  onHistoryPress,
  onCardSelect,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPadding = 90 + (insets.bottom > 0 ? insets.bottom : 16);

  // Fetch today's tarot data from GET /tarot/today/
  const { data: todayTarot, isLoading: isTarotLoading } = useTodayTarot();

  // POST mutation to draw card (/tarot/today/ with { card_number }) + auto revalidates query
  const { mutate: drawCard, isPending: isDrawingCard } = useDrawTarotCard();

  // Check if today's reading is already available
  const hasExistingRecord = Boolean(todayTarot?.has_record && todayTarot?.data);
  const tarotData = todayTarot?.data;

  console.log("todayTarot", todayTarot);
  useEffect(() => {
    if (todayTarot) {
      console.log("🔮 [CatTarotView] /tarot/today/ Data:", JSON.stringify(todayTarot, null, 2));
    }
  }, [todayTarot]);

  // Screen flow step: "intro" (landing) | "select_card" (pick 1 of 3 cards) | "revealed" (card reading)
  const [currentStep, setCurrentStep] = useState<"intro" | "select_card" | "revealed">("intro");
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const { width: screenWidth } = Dimensions.get("window");
  const cardWidth = Math.min(108, Math.max(90, Math.floor((screenWidth - 56) / 3)));
  const cardHeight = Math.round(cardWidth * 1.78);

  const handleBack = () => {
    if (isModalVisible) {
      setIsModalVisible(false);
      return;
    }
    if (currentStep === "select_card" || currentStep === "revealed") {
      setCurrentStep("intro");
      setSelectedCard(null);
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.navigate("/" as any);
      }
    }
  };

  const handleStartReadingPress = () => {
    if (hasExistingRecord) {
      // Data already available - skip card selection & POST, go directly to revealed card with bottom modal
      setCurrentStep("revealed");
      setIsModalVisible(true);
    } else {
      setCurrentStep("select_card");
    }
    if (onStartReading) {
      onStartReading();
    }
  };

  const handleCardPress = (cardNum: number) => {
    // If today's reading is already available, never hit POST again
    if (hasExistingRecord) {
      console.log("ℹ️ [CatTarotView] Record already exists, opening guidance modal directly.");
      setCurrentStep("revealed");
      setIsModalVisible(true);
      return;
    }

    if (isDrawingCard) return;
    setSelectedCard(cardNum);
    console.log(`🎴 [CatTarotView] Selected card ${cardNum}. Sending POST /tarot/today/ with body:`, {
      card_number: cardNum,
    });

    drawCard(cardNum, {
      onSuccess: (data) => {
        console.log("✅ [CatTarotView] Card draw success response:", data);
        setCurrentStep("revealed");
        setIsModalVisible(true);
        if (onCardSelect) {
          onCardSelect(cardNum);
        }
      },
      onError: (error) => {
        console.error("❌ [CatTarotView] Card draw error:", error);
      },
    });
  };

  // =========================================================================
  // STEP 3: Revealed Tarot Card Screen + Bottom Modal
  // =========================================================================
  if (currentStep === "revealed") {
    const revealedCardWidth = Math.min(200, Math.floor(screenWidth * 0.52));
    const revealedCardHeight = Math.round(revealedCardWidth * 1.78);

    return (
      <View className="w-full flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottomPadding }}
          className="w-full flex-1 px-4"
        >
          {/* 1. Top Navigation Bar */}
          <View className="w-full flex-row items-center justify-between pt-1 pb-2">
            {/* Back Button */}
            <TouchableOpacity
              onPress={handleBack}
              className="w-10 h-10 rounded-full bg-white/95 items-center justify-center border border-[#F3E8D5] shadow-sm active:opacity-80"
              style={{
                shadowColor: "rgba(93, 51, 39, 0.15)",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Ionicons name="arrow-back" size={20} color="#5D3327" />
            </TouchableOpacity>

            {/* Right History Button */}
            <TouchableOpacity
              onPress={onHistoryPress}
              className="w-10 h-10 rounded-full bg-white/95 items-center justify-center border border-[#F3E8D5] shadow-sm active:opacity-80"
              style={{
                shadowColor: "rgba(93, 51, 39, 0.15)",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Ionicons name="time-outline" size={17} color="#5D3327" />
            </TouchableOpacity>
          </View>

          {/* 2. Header Area */}
          <View className="items-center mt-1">
            {/* Overlapping Cards Top Icon */}
            <View className="relative w-12 h-11 items-center justify-center mb-1">
              <View className="w-7 h-9 rounded-md bg-white border border-[#C57723]/60 absolute -left-1 -top-0.5 rotate-[-12deg] items-center justify-center shadow-xs">
                <Text className="text-[10px] text-[#C57723]">✦</Text>
              </View>
              <View className="w-7 h-9 rounded-md bg-white border border-[#C57723]/80 absolute left-1 top-0.5 rotate-[8deg] items-center justify-center shadow-xs">
                <Text className="text-[10px] text-[#C57723]">🌙</Text>
              </View>
            </View>

            {/* Title & Subtitle */}
            <Text
              className="text-[30px] font-extrabold text-[#43160E] leading-tight text-center"
              style={{ fontFamily: "ZenMaruGothic-Black" }}
            >
              貓咪塔羅
            </Text>
            <Text
              className="text-xs font-bold text-[#5D3327] tracking-widest text-center mt-0.5 mb-2"
              style={{ fontFamily: "Sora-Bold" }}
            >
              ・ Cat Tarot ・
            </Text>
          </View>

          {/* 3. Center Revealed Tarot Card */}
          <View className="items-center justify-center my-2">
            <View
              className="rounded-3xl overflow-hidden"
              style={{
                width: revealedCardWidth,
                height: revealedCardHeight,
                shadowColor: "#C57723",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.45,
                shadowRadius: 14,
                elevation: 10,
              }}
            >
              <Image
                source={tarotCardImg}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            </View>

            {/* Button to re-open bottom modal if closed */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => setIsModalVisible(true)}
              className="bg-white/95 px-5 py-2.5 rounded-full border border-amber-200/90 shadow-sm flex-row items-center gap-2 mt-4"
              style={{
                shadowColor: "rgba(93, 51, 39, 0.15)",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text className="text-sm">🐾</Text>
              <View className="items-center">
                <Text
                  className="text-xs font-bold text-[#43160E]"
                  style={{ fontFamily: "ZenMaruGothic-Bold" }}
                >
                  查看今日指引
                </Text>
                <Text
                  className="text-[9px] font-bold text-[#7A5348]"
                  style={{ fontFamily: "Sora-Bold" }}
                >
                  View Today's Guidance
                </Text>
              </View>
              <Ionicons name="chevron-up" size={16} color="#43160E" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 4. Bottom Modal / Sheet with Slide-Up Animation */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <Pressable
            onPress={() => setIsModalVisible(false)}
            className="flex-1 justify-end bg-black/40"
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-[36px] px-6 pt-4 pb-8 items-center shadow-2xl"
              style={{
                paddingBottom: Math.max(insets.bottom, 16) + 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
                elevation: 16,
              }}
            >
              {/* Top Drag Handle */}
              <View className="w-10 h-1 bg-stone-300 rounded-full mb-3 self-center" />

              {/* Pink Pill Badge: 今日指引 / Today's Guidance */}
              <View className="bg-[#FEEBF0] px-4 py-1.5 rounded-full flex-row items-center gap-2 mb-3">
                <Text className="text-xs">🐾</Text>
                <View className="items-center">
                  <Text
                    className="text-xs font-bold text-[#EE5374]"
                    style={{ fontFamily: "ZenMaruGothic-Bold" }}
                  >
                    今日指引
                  </Text>
                  <Text
                    className="text-[9px] font-bold text-[#EE5374]"
                    style={{ fontFamily: "Sora-Bold" }}
                  >
                    Today's Guidance
                  </Text>
                </View>
              </View>

              {/* Title (Chinese + English) */}
              <Text
                className="text-[26px] font-extrabold text-[#43160E] text-center"
                style={{ fontFamily: "ZenMaruGothic-Black" }}
              >
                {tarotData?.title?.zh || "新的開始"}
              </Text>
              <Text
                className="text-sm font-bold text-[#7A5348] text-center mt-0.5"
                style={{ fontFamily: "Sora-Bold" }}
              >
                {tarotData?.title?.en || "A New Beginning"}
              </Text>

              {/* Pink Divider */}
              <View className="w-9 h-[2px] bg-[#EE5374]/60 rounded-full my-3" />

              {/* Content Description */}
              <Text
                className="text-[13.5px] font-medium text-[#43160E] text-center leading-6 px-1"
                style={{ fontFamily: "ZenMaruGothic-Medium" }}
              >
                {tarotData?.content?.zh}
              </Text>
              <Text
                className="text-xs font-normal text-[#7A5348] text-center leading-5 px-1 mt-2.5"
                style={{ fontFamily: "Sora-Regular" }}
              >
                {tarotData?.content?.en}
              </Text>

              {/* Continue Action Button */}
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => setIsModalVisible(false)}
                className="w-full bg-[#EE5374] rounded-full py-3.5 px-6 flex-row items-center justify-between mt-6 shadow-md"
                style={{
                  shadowColor: "#EE5374",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.35,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <View className="w-5" />
                <View className="items-center">
                  <Text
                    className="text-base font-bold text-white leading-5"
                    style={{ fontFamily: "ZenMaruGothic-Bold" }}
                  >
                    繼續探索
                  </Text>
                  <Text
                    className="text-[11px] font-semibold text-white/95 leading-4"
                    style={{ fontFamily: "Sora-SemiBold" }}
                  >
                    Continue
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    );
  }

  // =========================================================================
  // STEP 2: Choose a Card Screen (3 Tarot Cards 1, 2, 3)
  // =========================================================================
  if (currentStep === "select_card") {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        className="w-full flex-1 px-4"
      >
        {/* 1. Top Navigation Bar */}
        <View className="w-full flex-row items-center justify-between pt-1 pb-2">
          {/* Back Button (Returns to intro view) */}
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 rounded-full bg-white/95 items-center justify-center border border-[#F3E8D5] shadow-sm active:opacity-80"
            style={{
              shadowColor: "rgba(93, 51, 39, 0.15)",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#5D3327" />
          </TouchableOpacity>

          {/* Right History Button */}
          <TouchableOpacity
            onPress={onHistoryPress}
            className="w-10 h-10 rounded-full bg-white/95 items-center justify-center border border-[#F3E8D5] shadow-sm active:opacity-80"
            style={{
              shadowColor: "rgba(93, 51, 39, 0.15)",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="time-outline" size={17} color="#5D3327" />
          </TouchableOpacity>
        </View>

        {/* 2. Header Area */}
        <View className="items-center mt-1">
          {/* Overlapping Cards Top Icon */}
          <View className="relative w-12 h-11 items-center justify-center mb-1">
            <View className="w-7 h-9 rounded-md bg-white border border-[#C57723]/60 absolute -left-1 -top-0.5 rotate-[-12deg] items-center justify-center shadow-xs">
              <Text className="text-[10px] text-[#C57723]">✦</Text>
            </View>
            <View className="w-7 h-9 rounded-md bg-white border border-[#C57723]/80 absolute left-1 top-0.5 rotate-[8deg] items-center justify-center shadow-xs">
              <Text className="text-[10px] text-[#C57723]">🌙</Text>
            </View>
          </View>

          {/* Title & Subtitle */}
          <Text
            className="text-[30px] font-extrabold text-[#43160E] leading-tight text-center"
            style={{ fontFamily: "ZenMaruGothic-Black" }}
          >
            貓咪塔羅
          </Text>
          <Text
            className="text-xs font-bold text-[#5D3327] tracking-widest text-center mt-0.5"
            style={{ fontFamily: "Sora-Bold" }}
          >
            ・ Cat Tarot ・
          </Text>

          {/* Choose a Card Pill Badge */}
          <View className="bg-white/95 px-5 py-2 rounded-full border border-amber-200/90 shadow-sm flex-row items-center gap-2.5 mt-3.5 mb-5">
            <Text className="text-sm">🐾</Text>
            <View className="items-center">
              <Text
                className="text-sm font-bold text-[#43160E]"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                選擇一張牌
              </Text>
              <Text
                className="text-[10px] font-bold text-[#7A5348]"
                style={{ fontFamily: "Sora-Bold" }}
              >
                Choose a Card
              </Text>
            </View>
            <Text className="text-sm">🐾</Text>
          </View>
        </View>

        {/* 3. Three Tarot Cards in Middle with Number Badges 1, 2, 3 */}
        <View className="w-full flex-row justify-center items-center gap-2.5 my-2">
          {[1, 2, 3].map((num) => {
            const isSelected = selectedCard === num;
            return (
              <TouchableOpacity
                key={num}
                activeOpacity={0.85}
                disabled={isDrawingCard}
                onPress={() => handleCardPress(num)}
                className="items-center"
                style={{
                  transform: [{ translateY: isSelected ? -8 : 0 }],
                  opacity: isDrawingCard && !isSelected ? 0.6 : 1,
                }}
              >
                {/* Individual Tarot Card Image Container */}
                <View
                  className="rounded-2xl overflow-hidden"
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    shadowColor: isSelected ? "#C57723" : "rgba(67, 22, 14, 0.25)",
                    shadowOffset: { width: 0, height: isSelected ? 8 : 4 },
                    shadowOpacity: isSelected ? 0.5 : 0.3,
                    shadowRadius: isSelected ? 10 : 5,
                    elevation: isSelected ? 8 : 4,
                  }}
                >
                  <Image
                    source={tarotCardImg}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="contain"
                  />
                </View>

                {/* Card Number Badge (1, 2, 3) */}
                <View
                  className={`w-7 h-7 rounded-full items-center justify-center shadow-sm mt-3 ${isSelected
                    ? "bg-[#DF4587] border-2 border-white"
                    : "bg-[#C57723] border border-amber-200"
                    }`}
                  style={{
                    shadowColor: "#5D3327",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 3,
                  }}
                >
                  {isSelected && isDrawingCard ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text
                      className="text-xs font-bold text-white leading-none"
                      style={{ fontFamily: "Sora-Bold" }}
                    >
                      {num}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 4. Bottom Guide Text */}
        <View className="items-center mt-5 px-4">
          <Text
            className="text-base font-bold text-[#43160E] text-center"
            style={{ fontFamily: "ZenMaruGothic-Bold" }}
          >
            {isDrawingCard ? "正在為您抽取卡牌..." : "選擇一張牌，看看今天的指引。"}
          </Text>
          <Text
            className="text-xs text-[#7A5348] text-center mt-1 font-medium"
            style={{ fontFamily: "Sora-Medium" }}
          >
            {isDrawingCard
              ? "Drawing your card and revealing today's fortune..."
              : "Pick a card to reveal your guide for today."}
          </Text>
        </View>
      </ScrollView>
    );
  }

  // =========================================================================
  // STEP 1: Landing Intro Screen (Cat Holding Cards + Start Reading Button)
  // =========================================================================
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      className="w-full flex-1 px-4"
    >
      {/* 1. Top Navigation Bar (Back Button + Center Cards Icon + History Button) */}
      <View className="w-full flex-row items-center justify-between pt-1 pb-3">
        {/* Left Back Arrow */}
        <TouchableOpacity
          onPress={handleBack}
          className="w-10 h-10 rounded-full bg-white/90 items-center justify-center border border-[#F3E8D5] shadow-sm active:opacity-80"
          style={{
            shadowColor: "rgba(93, 51, 39, 0.15)",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#5D3327" />
        </TouchableOpacity>

        {/* Center Cards Stack Icon */}
        <View className="w-12 h-10 items-center justify-center">
          <View className="relative w-8 h-8 items-center justify-center">
            {/* Simple stacked cards graphic */}
            <View className="w-6 h-7 rounded-md bg-white border border-[#5D3327] absolute -left-1 -top-0.5 rotate-[-12deg] items-center justify-center">
              <Text className="text-[9px]">✦</Text>
            </View>
            <View className="w-6 h-7 rounded-md bg-white border border-[#5D3327] absolute left-1 top-0.5 rotate-[8deg] items-center justify-center">
              <Text className="text-[9px]">🌙</Text>
            </View>
          </View>
        </View>

        {/* Right History Button (占卜紀錄 History) */}
        <TouchableOpacity
          onPress={onHistoryPress}
          className="w-11 h-11 rounded-full bg-white/90 items-center justify-center border border-[#F3E8D5] shadow-sm active:opacity-80"
          style={{
            shadowColor: "rgba(93, 51, 39, 0.15)",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons name="time-outline" size={15} color="#5D3327" />
          <Text
            className="text-[7.5px] font-bold text-[#5D3327] leading-none mt-0.5"
            style={{ fontFamily: "ZenMaruGothic-Bold" }}
          >
            占卜紀錄
          </Text>
          <Text
            className="text-[5.5px] text-[#A89F91] leading-none"
            style={{ fontFamily: "Sora-Medium" }}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. Main Title Section */}
      <View className="items-center mt-1 mb-2">
        <Text
          className="text-[32px] font-extrabold text-[#43160E] leading-tight text-center"
          style={{ fontFamily: "ZenMaruGothic-Black" }}
        >
          貓咪塔羅
        </Text>
        <Text
          className="text-sm font-bold text-[#5D3327] tracking-widest text-center mt-0.5 mb-2"
          style={{ fontFamily: "Sora-Bold" }}
        >
          ・ Cat Tarot ・
        </Text>

        <Text
          className="text-base font-bold text-[#5D3327] text-center leading-6"
          style={{ fontFamily: "ZenMaruGothic-Bold" }}
        >
          讓貓咪為你指引方向
        </Text>
        <Text
          className="text-xs text-[#7A5348] text-center leading-4 mt-0.5"
          style={{ fontFamily: "Sora-Medium" }}
        >
          Let the cats guide your path.
        </Text>
      </View>

      {/* 3. Center Hero Cat holding 3 Tarot Cards Graphic */}
      <View className="w-full items-center justify-center my-3 relative">
        <Image
          source={catTarotMiddle}
          style={{ width: 330, height: 240 }}
          resizeMode="contain"
        />
      </View>

      {/* 4. Sub Title Sparkle Box (抽一張牌，看看今天的指引吧！) */}
      <View
        className="w-[320px] self-center px-3.5 py-4 relative bg-[#FFF9EE] border-[1.5px] border-orange-200 rounded-[22px] items-center justify-center my-3"
        style={{
          shadowColor: "rgba(0, 0, 0, 0.05)",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        {/* Left Paw Accent */}
        <Image
          source={alarmHeaderPng}
          className="left-[16px] top-[14px] absolute w-10 h-8 opacity-90 -rotate-12"
          resizeMode="contain"
        />

        {/* Right Paw Accent */}
        <Image
          source={alarmHeaderPng}
          className="right-[16px] top-[14px] absolute w-10 h-8 opacity-90 rotate-12"
          resizeMode="contain"
        />

        {/* Chinese Main Title */}
        <Text
          className="text-center text-[#43160E] text-sm font-bold leading-5 tracking-wide"
          style={{ fontFamily: "ZenMaruGothic-Bold" }}
        >
          抽一張牌，看看今天的指引吧！
        </Text>

        {/* English Subtitle */}
        <View className="mt-1.5 pt-1.5 items-center border-t border-orange-200/70">
          <Text
            className="text-center text-[#43160E]/85 text-[11px] font-bold leading-4"
            style={{ fontFamily: "ZenMaruGothic-Bold" }}
          >
            Draw a card and see what{"\n"}today brings you!
          </Text>
        </View>
      </View>

      {/* 5. Start Reading Main Action Button (開始占卜 Start Reading) */}
      <TouchableOpacity
        onPress={handleStartReadingPress}
        activeOpacity={0.9}
        className="w-full bg-[#C57723] border border-[#DFA050] rounded-full py-4 px-5 flex-row items-center justify-between shadow-md mt-4"
        style={{
          shadowColor: "#C57723",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        {/* Left Circle Icon */}
        <View className="w-9 h-9 rounded-full bg-white/25 items-center justify-center border border-white/40">
          <View className="w-4 h-5 rounded-[3px] bg-white items-center justify-center">
            <Text className="text-[7px] text-[#C57723]">✦</Text>
          </View>
        </View>

        {/* Center Text */}
        <View className="items-center flex-1">
          <Text
            className="text-lg font-extrabold text-white text-center leading-6"
            style={{ fontFamily: "ZenMaruGothic-Bold" }}
          >
            {hasExistingRecord ? "查看今日指引" : "開始占卜"}
          </Text>
          <Text
            className="text-xs text-white/95 text-center leading-4 tracking-wide"
            style={{ fontFamily: "Sora-SemiBold" }}
          >
            {hasExistingRecord ? "View Today's Reading" : "Start Reading"}
          </Text>
        </View>

        {/* Right Arrow */}
        <View className="w-9 h-9 rounded-full bg-white/25 items-center justify-center border border-white/40">
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CatTarotView;

