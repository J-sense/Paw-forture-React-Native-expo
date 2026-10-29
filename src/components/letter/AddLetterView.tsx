import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { STICKERS, StickerItem } from "@/components/calendar/CalendarView";
import {
  useCreateLetter,
  useUpdateLetter,
  useLetterDetail,
} from "@/hooks/useLetter";
import { toast } from "burnt";

const heroTopRight = require("../../../assets/images/hero-top-right.png");

type StickerCategory = "all" | "cat" | "food" | "mood";

export const AddLetterView: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const bottomPadding = 40 + (insets.bottom > 0 ? insets.bottom : 16);

  const letterId = params.id as string | undefined;
  const isEdit = Boolean(letterId);

  // Queries & Mutations
  const { mutate: createLetter, isPending: isCreating } = useCreateLetter();
  const { mutate: updateLetter, isPending: isUpdating } = useUpdateLetter();
  const { data: detailRes } = useLetterDetail(isEdit ? letterId : undefined);
  const isSaving = isCreating || isUpdating;

  // Form State
  const [title, setTitle] = useState((params.title as string) || "");
  const [content, setContent] = useState((params.content as string) || "");
  const [selectedSticker, setSelectedSticker] = useState<StickerItem>(() => {
    if (params.sticker) {
      const found = STICKERS.find((s) => s.id === params.sticker);
      if (found) return found;
    }
    return STICKERS[0];
  });
  const [stickerCategory, setStickerCategory] = useState<StickerCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync state if fetched from detail API
  useEffect(() => {
    const apiLetter = (detailRes as any)?.data || detailRes;
    if (apiLetter && isEdit) {
      if (apiLetter.title && !title) setTitle(apiLetter.title);
      if (apiLetter.content && !content) setContent(apiLetter.content);
      if (apiLetter.sticker) {
        const found = STICKERS.find((s) => s.id === apiLetter.sticker);
        if (found) setSelectedSticker(found);
      }
    }
  }, [detailRes, isEdit]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate("/" as any);
    }
  };

  // Filter stickers based on selected category & search query
  const filteredStickers = useMemo(() => {
    let list = STICKERS;

    // Filter by Category tag
    if (stickerCategory === "cat") {
      list = list.filter((s) =>
        s.tags.some((t) => t.includes("貓") || t.includes("cat") || t.includes("kitty"))
      );
    } else if (stickerCategory === "food") {
      list = list.filter((s) =>
        s.tags.some((t) =>
          t.includes("咖啡") || t.includes("蛋糕") || t.includes("魚") || t.includes("food")
        )
      );
    } else if (stickerCategory === "mood") {
      list = list.filter((s) =>
        s.tags.some((t) =>
          t.includes("心") || t.includes("星") || t.includes("love") || t.includes("luck")
        )
      );
    }

    // Filter by Search text query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (stk) =>
          stk.name.toLowerCase().includes(q) ||
          stk.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [stickerCategory, searchQuery]);

  const handleSaveLetter = () => {
    if (isSaving) return;

    if (!content.trim()) {
      toast({
        title: "Please Write Your Letter",
        message: "請輸入想對未來的自己說的話。",
        preset: "error",
      });
      return;
    }

    if (isEdit && letterId) {
      // ══════════════════════════════════════════════════════════════
      // EDIT: PATCH /letters/{id}/
      // ══════════════════════════════════════════════════════════════
      updateLetter(
        {
          id: letterId,
          payload: {
            title: title.trim() || undefined,
            content: content.trim(),
            sticker: selectedSticker?.id,
          },
        },
        {
          onSuccess: (res: any) => {
            console.log("✅ Letter Updated Response:", res);
            toast({
              title: res?.message_eng || "Letter updated successfully.",
              message: res?.message_chinese || "信件更新成功。",
              preset: "done",
              duration: 4,
            });

            setTimeout(() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(tabs)");
              }
            }, 1000);
          },
          onError: (error: any) => {
            if (error?.response?.status === 401) return;
            toast({
              title:
                error?.response?.data?.message_eng ||
                error?.message ||
                "Failed to update letter",
              message: error?.response?.data?.message_chinese,
              preset: "error",
            });
          },
        }
      );
    } else {
      // ══════════════════════════════════════════════════════════════
      // CREATE: POST /letters/
      // ══════════════════════════════════════════════════════════════
      createLetter(
        {
          sticker: selectedSticker?.id || "bear",
          title: title.trim() || undefined,
          content: content.trim(),
        },
        {
          onSuccess: (res: any) => {
            console.log("✅ Letter Saved Response:", res);
            toast({
              title: res?.message_eng || "Letter saved successfully.",
              message: res?.message_chinese || "信件保存成功。",
              preset: "done",
              duration: 4,
            });

            setTimeout(() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(tabs)");
              }
            }, 1000);
          },
          onError: (error: any) => {
            if (error?.response?.status === 401) return;
            toast({
              title:
                error?.response?.data?.message_eng ||
                error?.message ||
                "Failed to save letter",
              message: error?.response?.data?.message_chinese,
              preset: "error",
            });
          },
        }
      );
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      className="flex-1 w-full px-3 pt-1"
    >
      {/* 1. Top Bar (Back Arrow + Center Title) */}
      <View className="w-full flex-row items-center justify-between pt-1 pb-2 px-1">
        <TouchableOpacity
          onPress={handleBack}
          className="w-10 h-10 rounded-full bg-white items-center justify-center border border-[#F3E8D5] active:opacity-80"
          style={styles.backBtnShadow}
        >
          <Ionicons name="arrow-back" size={20} color="#4A3E3D" />
        </TouchableOpacity>

        <View className="items-center flex-1 px-2">
          <Text
            className="text-2xl font-extrabold text-[#43160E] leading-tight text-center"
            style={{ fontFamily: "ZenMaruGothic-Black" }}
          >
            {isEdit ? "編輯信件" : "貓掌命運手帳"}
          </Text>
          <Text
            className="text-xs font-bold text-[#5D3327] tracking-wider text-center mt-0.5"
            style={{ fontFamily: "Sora-Bold" }}
          >
            {isEdit ? "・ Edit Letter ・" : "・ Cat Paw Destiny ・"}
          </Text>
        </View>

        <View className="w-10" />
      </View>

      {/* 2. Main Hero Header Banner Row (Left Text + Right Cat Graphic) */}
      <View className="w-full flex-row items-center justify-between my-3 px-2">
        {/* Left Column Text */}
        <View className="flex-1 pr-2">
          <Text
            className="text-[24px] font-extrabold text-[#43160E] leading-tight"
            style={{ fontFamily: "ZenMaruGothic-Black" }}
          >
            {isEdit ? (
              <>
                編輯<Text className="text-[#F43F5E]">時空</Text>信件
              </>
            ) : (
              <>
                寫給<Text className="text-[#F43F5E]">未來</Text>的你
              </>
            )}
          </Text>

          <Text
            className="text-xs font-bold text-[#5D3327] mt-1.5"
            style={{ fontFamily: "ZenMaruGothic-Bold" }}
          >
            {isEdit ? "重新琢磨想對未來自己說的話" : "用文字，記錄此刻的自己"}
          </Text>
          <Text
            className="text-xs font-bold text-[#5D3327] mt-0.5"
            style={{ fontFamily: "ZenMaruGothic-Bold" }}
          >
            {isEdit ? "讓未來的約定更加清晰美好。" : "給未來一個溫暖的約定。"}
          </Text>

          <Text
            className="text-[9px] font-bold text-[#8C7B75] mt-1"
            style={{ fontFamily: "Sora-Bold" }}
          >
            {isEdit ? "Update your letter to future self" : "Write a letter to your future self"}
          </Text>
        </View>

        {/* Right Mascot Image */}
        <Image
          source={heroTopRight}
          className="w-20 h-20"
          resizeMode="contain"
        />
      </View>

      {/* 3. Main Form Container Card */}
      <View
        className="w-full bg-[#FFFDF8] rounded-[28px] p-4 border border-[#F3E2C4] my-2"
        style={styles.mainCardShadow}
      >
        {/* SECTION A: 信件貼紙選擇器 Sticker Picker */}
        <View className="w-full pb-4 border-b border-dashed border-[#ECD5A0]">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-sm">✨</Text>
              <Text
                className="text-sm font-bold text-[#43160E]"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                選擇信件貼紙
              </Text>
              <Text
                className="text-[10px] font-bold text-[#8C7B75]"
                style={{ fontFamily: "Sora-Bold" }}
              >
                Select Sticker
              </Text>
            </View>

            {/* Selected Sticker Preview Pill */}
            <View className="flex-row items-center gap-1 bg-[#FFF4DC] px-2.5 py-1 rounded-full border border-[#F3DFB0]">
              <Text className="text-base">{selectedSticker?.emoji}</Text>
              <Text
                className="text-xs font-bold text-[#6D4233]"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                {selectedSticker?.name}
              </Text>
            </View>
          </View>

          {/* Search Box */}
          <View className="w-full bg-white rounded-xl px-3 py-1.5 flex-row items-center border border-[#F0DFBE] my-1.5">
            <Ionicons name="search" size={15} color="#A89F91" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="搜尋貼紙 Search sticker..."
              placeholderTextColor="#A89F91"
              className="flex-1 ml-2 text-xs text-[#43160E] py-0"
              style={{ fontFamily: "ZenMaruGothic-Medium" }}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={15} color="#A89F91" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Category Pills */}
          <View className="flex-row items-center gap-1.5 my-2">
            {[
              { id: "all", labelZh: "全部", labelEn: "All" },
              { id: "cat", labelZh: "貓咪", labelEn: "Cats" },
              { id: "food", labelZh: "美食", labelEn: "Food" },
              { id: "mood", labelZh: "心情", labelEn: "Mood" },
            ].map((cat) => {
              const isSelected = stickerCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setStickerCategory(cat.id as StickerCategory)}
                  activeOpacity={0.8}
                  style={[
                    styles.categoryPill,
                    isSelected && styles.activeCategoryPill,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      isSelected && styles.activeCategoryPillText,
                    ]}
                  >
                    {cat.labelZh}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Sticker Grid List */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-2.5 py-1"
          >
            {filteredStickers.map((stk) => {
              const isPicked = selectedSticker?.id === stk.id;
              return (
                <TouchableOpacity
                  key={stk.id}
                  onPress={() => setSelectedSticker(stk)}
                  activeOpacity={0.8}
                  style={[
                    styles.stickerTile,
                    { backgroundColor: stk.bgColor || "#FFFDF0" },
                    isPicked && styles.selectedStickerTile,
                  ]}
                >
                  <Text style={styles.stickerEmoji}>{stk.emoji}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* SECTION B: 信件標題 Title Input */}
        <View className="w-full pt-4 pb-3">
          <View className="flex-row items-center gap-1.5 mb-1.5">
            <Text className="text-sm">📌</Text>
            <Text
              className="text-sm font-bold text-[#43160E]"
              style={{ fontFamily: "ZenMaruGothic-Bold" }}
            >
              信件主旨
            </Text>
            <Text
              className="text-[10px] font-bold text-[#8C7B75]"
              style={{ fontFamily: "Sora-Bold" }}
            >
              Subject Title (選填 Optional)
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="例如：未來的我，你好！"
              placeholderTextColor="#BDB4A8"
              maxLength={50}
              className="w-full text-sm text-[#43160E] py-1"
              style={{ fontFamily: "ZenMaruGothic-Bold" }}
            />
          </View>
        </View>

        {/* SECTION C: 信件內文 Content Body */}
        <View className="w-full pt-2">
          <View className="flex-row items-center justify-between mb-1.5">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-sm">✍️</Text>
              <Text
                className="text-sm font-bold text-[#43160E]"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                信件內容
              </Text>
              <Text
                className="text-[10px] font-bold text-[#8C7B75]"
                style={{ fontFamily: "Sora-Bold" }}
              >
                Letter Content
              </Text>
            </View>

            {/* Word Counter */}
            <Text
              className={`text-xs font-bold ${
                content.length > 900 ? "text-[#F43F5E]" : "text-[#A89F91]"
              }`}
              style={{ fontFamily: "Sora-Bold" }}
            >
              {content.length} / 1000
            </Text>
          </View>

          {/* Letter Styled Text Area */}
          <View className="w-full bg-[#FFFDF0] rounded-2xl p-4 border border-[#F3E2C4] relative min-h-[220px]">
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="寫下想對未來的自己說的話、一個小願望，或是現在遇到的心情... (不管遇到什麼困難，都不要放棄喔！)"
              placeholderTextColor="#C4B9AA"
              multiline
              maxLength={1000}
              textAlignVertical="top"
              className="w-full flex-1 text-sm text-[#43160E] leading-6"
              style={{ fontFamily: "ZenMaruGothic-Medium", minHeight: 180 }}
            />
          </View>
        </View>

        {/* SECTION D: 封存提示 Seal Note Banner */}
        <View
          className="w-full bg-[#FFF3DC] rounded-xl p-3 flex-row items-center gap-2.5 mt-4 border border-[#F4DFC0]"
          style={styles.lockBannerShadow}
        >
          <View className="w-8 h-8 rounded-full bg-[#FFE5B4] items-center justify-center">
            <Ionicons name="time" size={17} color="#D97706" />
          </View>
          <View className="flex-1">
            <Text
              className="text-xs font-bold text-[#78350F]"
              style={{ fontFamily: "ZenMaruGothic-Bold" }}
            >
              {isEdit ? "時空膠囊修改須知" : "時空信件封存保證"}
            </Text>
            <Text
              className="text-[10px] font-medium text-[#92400E] mt-0.5 leading-4"
              style={{ fontFamily: "ZenMaruGothic-Medium" }}
            >
              {isEdit
                ? "修改後的內容將更新保存於時空膠囊中，陪伴你邁向未來。"
                : "信件封存後將妥善珍藏於你的命運手帳，等待約定的那天開啟。"}
            </Text>
          </View>
        </View>

        {/* SECTION E: 儲存 / 更新信件按鈕 Action Submit Button */}
        <TouchableOpacity
          onPress={handleSaveLetter}
          disabled={isSaving}
          activeOpacity={0.88}
          className="w-full bg-[#F43F5E] py-4 px-4 rounded-full flex-row items-center justify-between mt-5 active:scale-[0.98]"
          style={styles.saveBtnShadow}
        >
          {isSaving ? (
            <View className="flex-1 items-center justify-center py-1">
              <ActivityIndicator color="#FFFFFF" />
            </View>
          ) : (
            <>
              {/* Left Send Icon */}
              <Ionicons
                name={isEdit ? "checkmark-done" : "paper-plane"}
                size={20}
                color="#FFFFFF"
              />

              {/* Center Text */}
              <View className="items-center flex-1 px-2">
                <Text
                  className="text-base font-extrabold text-white text-center leading-tight"
                  style={{ fontFamily: "ZenMaruGothic-Bold" }}
                >
                  {isEdit ? "更新信件" : "保存信件"}
                </Text>
                <Text
                  className="text-xs font-bold text-white/90 text-center leading-tight mt-0.5"
                  style={{ fontFamily: "Sora-Bold" }}
                >
                  {isEdit ? "Update My Letter" : "Save My Letter"}
                </Text>
              </View>

              {/* Right Circle Arrow Button */}
              <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
                <Ionicons name="chevron-forward" size={16} color="#F43F5E" />
              </View>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backBtnShadow: {
    shadowColor: "#5D3327",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  mainCardShadow: {
    shadowColor: "#DCB978",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 5,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: "#F5F5F4",
  },
  activeCategoryPill: {
    backgroundColor: "#F43F5E",
    shadowColor: "#F43F5E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#5D3327",
    fontFamily: "ZenMaruGothic-Bold",
  },
  activeCategoryPillText: {
    color: "#FFFFFF",
  },
  stickerTile: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#FFFFFF",
    borderBottomWidth: 1.5,
    borderBottomColor: "#ECD5A0",
    borderLeftWidth: 1,
    borderLeftColor: "#ECD5A0",
    borderRightWidth: 1,
    borderRightColor: "#ECD5A0",
    shadowColor: "#DCB978",
    shadowOffset: { width: 0, height: 2.65 },
    shadowOpacity: 0.35,
    shadowRadius: 5.3,
    elevation: 4,
  },
  selectedStickerTile: {
    borderWidth: 2,
    borderColor: "#F43F5E",
    shadowColor: "#F43F5E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  stickerEmoji: {
    fontSize: 22,
    textAlign: "center",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.9)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#DCB978",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1.5,
  },
  lockBannerShadow: {
    shadowColor: "#ECD5A0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  saveBtnShadow: {
    shadowColor: "#F43F5E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default AddLetterView;
