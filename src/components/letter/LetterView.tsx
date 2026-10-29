import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useLetters, useOpenLetter } from "@/hooks/useLetter";
import {
  ApiLetter,
  LetterItem,
  LetterTabType,
  mapApiLetterToItem,
} from "./LetterItem";
import { LetterHeader } from "./LetterHeader";
import { LetterTabFilter } from "./LetterTabFilter";
import { LetterCard } from "./LetterCard";

export const LetterView: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPadding = 90 + (insets.bottom > 0 ? insets.bottom : 16);

  const [activeTab, setActiveTab] = useState<LetterTabType>("all");

  // 1. Fetch real letter data from API with active tab filter
  const { data, isLoading, isError, refetch, isRefetching } = useLetters(activeTab);

  // 2. Mutation to mark letter as opened when tapped
  const { mutate: openLetter } = useOpenLetter();

  // 3. Parse API response safely
  const rawList: ApiLetter[] = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  // 4. Map into UI LetterItem format
  const letters: LetterItem[] = useMemo(() => {
    return rawList.map(mapApiLetterToItem);
  }, [rawList]);

  // 5. Filter letters based on selected tab
  const filteredLetters = useMemo(() => {
    return letters.filter((item) => {
      if (activeTab === "pending") return item.status === "pending";
      if (activeTab === "opened") return item.status === "opened";
      return true;
    });
  }, [letters, activeTab]);

  const handleAddLetter = () => {
    router.push("/add-letter");
  };

  const handleCardPress = (selected: LetterItem) => {
    // If unopened/pending, send { status: "opened" } to /letters/<pk>/
    if (selected.status === "pending") {
      console.log(`✉️ Opening letter ${selected.id}...`);
      openLetter(selected.id);
    }

    router.push({
      pathname: "/letter-detail",
      params: {
        id: selected.id,
        titleCn: selected.titleCn,
        titleEn: selected.titleEn,
        descCn: selected.descCn,
        descEn: selected.descEn,
        content: selected.rawContent || selected.descCn,
        date: selected.date,
        icon: selected.icon,
      },
    });
  };

  // Determine empty-state copy
  const getEmptyStateContent = () => {
    if (activeTab === "pending") {
      return {
        icon: "💌",
        title: "尚無未開啟信件 No Unopened Letters",
        desc: "所有信件都已開啟，或點擊右上角「+」為未來的自己寫一封新信吧！",
      };
    }
    if (activeTab === "opened") {
      return {
        icon: "📬",
        title: "尚無已開啟信件 No Opened Letters",
        desc: "寄往未來的信件開啟後會在此保留珍藏。",
      };
    }
    return {
      icon: "📮",
      title: "尚無信件 No Letters Yet",
      desc: "點擊右上角「+」按鈕，為未來的自己寫第一封信吧！",
    };
  };

  const emptyState = getEmptyStateContent();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      className="flex-1 w-full px-3"
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor="#F43F5E"
          colors={["#F43F5E"]}
        />
      }
    >
      {/* 1. Header Section */}
      <LetterHeader onAddPress={handleAddLetter} />

      {/* 2. Top Tab Pill Bar */}
      <LetterTabFilter activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3. Loading State */}
      {isLoading && !data ? (
        <View className="w-full bg-white/80 rounded-[24px] p-8 items-center justify-center my-6 border border-[#F3E8D5]">
          <ActivityIndicator size="large" color="#F43F5E" />
          <Text
            className="text-xs text-[#8C7B75] text-center mt-3 font-bold"
            style={{ fontFamily: "ZenMaruGothic-Medium" }}
          >
            正在載入未來信件... Loading Letters...
          </Text>
        </View>
      ) : isError && !data ? (
        /* Error State */
        <View className="w-full bg-white/90 rounded-[24px] p-8 items-center justify-center my-6 border border-[#FEE2E2]">
          <Text className="text-4xl mb-2">⚠️</Text>
          <Text
            className="text-sm font-bold text-[#DC2626]"
            style={{ fontFamily: "ZenMaruGothic-Bold" }}
          >
            載入信件失敗 Failed to Load Letters
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            activeOpacity={0.8}
            className="mt-3 px-5 py-2.5 bg-[#F43F5E] rounded-full active:opacity-90"
          >
            <Text
              className="text-xs font-bold text-white"
              style={{ fontFamily: "ZenMaruGothic-Bold" }}
            >
              重新嘗試 Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : filteredLetters.length > 0 ? (
        /* Filtered Letter List */
        <View className="w-full">
          {filteredLetters.map((item) => (
            <LetterCard key={item.id} item={item} onPress={handleCardPress} />
          ))}
        </View>
      ) : (
        /* Empty / No Data State */
        <View className="w-full bg-white/80 rounded-[24px] p-8 items-center justify-center my-6 border border-[#F3E8D5]">
          <Text className="text-4xl mb-2">{emptyState.icon}</Text>
          <Text
            className="text-sm font-bold text-[#5D3327]"
            style={{ fontFamily: "ZenMaruGothic-Bold" }}
          >
            {emptyState.title}
          </Text>
          <Text
            className="text-xs text-[#A89F91] text-center mt-1.5 px-4 leading-5"
            style={{ fontFamily: "ZenMaruGothic-Medium" }}
          >
            {emptyState.desc}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default LetterView;
