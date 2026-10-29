import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLetterDetail, useDeleteLetter } from "@/hooks/useLetter";
import { STICKERS } from "@/components/calendar/CalendarView";
import { toast } from "burnt";

interface LetterDetailViewProps {
  id?: string;
  titleCn?: string;
  titleEn?: string;
  descCn?: string;
  descEn?: string;
  content?: string;
  date?: string;
  icon?: string;
}

export const LetterDetailView: React.FC<LetterDetailViewProps> = (props) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const bottomPadding = 40 + (insets.bottom > 0 ? insets.bottom : 16);

  const letterId = (params.id as string) || props.id;

  // 1. Fetch real letter details via GET /letters/<pk>/
  const { data: detailRes, isLoading } = useLetterDetail(letterId);
  // 2. Delete letter mutation
  const { mutate: deleteLetter, isPending: isDeleting } = useDeleteLetter();

  const apiData = useMemo(() => {
    return (detailRes as any)?.data || detailRes;
  }, [detailRes]);

  const stickerObj = useMemo(() => {
    if (!apiData?.sticker) return null;
    return STICKERS.find((s) => s.id === apiData.sticker);
  }, [apiData?.sticker]);

  const titleCn =
    apiData?.title ||
    (params.titleCn as string) ||
    props.titleCn ||
    "未來的我，你好！";
  const titleEn =
    apiData?.titleEn ||
    stickerObj?.name ||
    (params.titleEn as string) ||
    props.titleEn ||
    "Hello, Future Me!";
  const icon =
    stickerObj?.emoji || (params.icon as string) || props.icon || "💖";
  const letterContent =
    apiData?.content ||
    (params.content as string) ||
    (params.descCn as string) ||
    props.content ||
    props.descCn ||
    "希望那時候的我，已經實現了現在的夢想，不管遇到什麼困難，都不要放棄。要成為更勇敢、更自律、更快樂的人。記得保持熱愛，繼續努力，因為未來的你，一定會感謝現在這麼努力的自己！";
  const dateStr =
    apiData?.formatted_date_zh ||
    apiData?.formatted_date_en ||
    apiData?.date ||
    (params.date as string) ||
    props.date;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate("/" as any);
    }
  };

  const handleEdit = () => {
    router.push({
      pathname: "/add-letter",
      params: {
        id: letterId,
        title: titleCn,
        content: letterContent,
        sticker: apiData?.sticker,
      },
    });
  };

  const handleDelete = () => {
    if (!letterId) {
      if (router.canGoBack()) router.back();
      return;
    }

    Alert.alert(
      "刪除信件 Delete Letter",
      "確定要刪除這封寄給未來的信件嗎？此動作無法復原。",
      [
        { text: "取消 Cancel", style: "cancel" },
        {
          text: "刪除 Delete",
          style: "destructive",
          onPress: () => {
            deleteLetter(letterId, {
              onSuccess: (res: any) => {
                console.log("✅ Delete Letter Response:", res);
                toast({
                  title: res?.message_eng || "Letter deleted successfully.",
                  message: res?.message_chinese || "信件已成功删除。",
                  preset: "done",
                  duration: 3,
                });

                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)");
                }
              },
              onError: (error: any) => {
                if (error?.response?.status === 401) return;
                toast({
                  title:
                    error?.response?.data?.message_eng ||
                    error?.message ||
                    "Failed to delete letter",
                  message: error?.response?.data?.message_chinese,
                  preset: "error",
                });
              },
            });
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      const shareContent = [
        `💌 【貓掌命運手帳・時空信件】`,
        `📌 ${titleCn}`,
        `━━━━━━━━━━━━━━━`,
        `"${letterContent}"`,
        `━━━━━━━━━━━━━━━`,
        Boolean(dateStr) ? `📅 約定日期：${dateStr}` : "",
        `✨ 來自 Cat Paw Destiny 手帳`,
      ]
        .filter(Boolean)
        .join("\n\n");

      await Share.share({
        message: shareContent,
        title: titleCn,
      });
    } catch (error: any) {
      console.error("Error sharing letter:", error?.message);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      className="flex-1 w-full px-4 pt-2"
    >
      {/* 1. Top Header Bar (Back Button + Title Group) */}
      <View className="w-full flex-row items-center justify-between pt-1 pb-2">
        {/* Left Back Button */}
        <TouchableOpacity
          onPress={handleBack}
          className="w-10 h-10 rounded-full bg-white items-center justify-center border border-[#F3E8D5] active:opacity-80"
          style={styles.backBtnShadow}
        >
          <Ionicons name="arrow-back" size={20} color="#4A3E3D" />
        </TouchableOpacity>

        {/* Center Title Group */}
        <View className="items-center flex-1 px-2">
          <Text
            className="text-2xl font-extrabold text-[#43160E] leading-tight text-center"
            style={{ fontFamily: "ZenMaruGothic-Black" }}
          >
            {titleCn}
          </Text>
          <Text
            className="text-xs font-bold text-[#5D3327] tracking-wider text-center mt-0.5"
            style={{ fontFamily: "Sora-Bold" }}
          >
            ・ Cat Paw Destiny ・
          </Text>
        </View>

        {/* Spacer to align center title */}
        <View className="w-10" />
      </View>

      {/* 2. Peeking Cat Mascot Illustration */}
      <View className="w-full items-center justify-center mt-3 -mb-5 z-20">
        <View
          className="w-20 h-20 rounded-full bg-amber-100/90 items-center justify-center border-2 border-amber-200 relative"
          style={styles.mascotShadow}
        >
          <Text className="text-4xl">🐱</Text>
          {/* Envelope overlay */}
          <View className="absolute -bottom-1 -right-1 bg-rose-100 px-1.5 py-0.5 rounded-full border border-rose-200">
            <Text className="text-xs">💌</Text>
          </View>
        </View>
      </View>

      {/* 3. Main Airmail Bordered Letter Container */}
      <View
        className="w-full rounded-[28px] p-2 bg-[#F472B6]/20 border-4 border-dashed border-[#F472B6]/40 my-2"
        style={styles.airmailCardShadow}
      >
        {/* Inner Grid Notebook Paper Card */}
        <View className="w-full bg-[#FFFDF0] rounded-[24px] p-5 border border-[#F3E2C4] relative overflow-hidden">
          {/* Card Header (Icon Avatar + Titles + Date Badge) */}
          <View className="flex-row items-center gap-3 pb-3 border-b border-dashed border-[#EACD9B]">
            <View className="w-12 h-12 rounded-2xl bg-pink-100/80 items-center justify-center border border-pink-200">
              <Text className="text-2xl">{icon}</Text>
            </View>

            <View className="flex-1">
              <Text
                className="text-base font-bold text-[#3A2E2B]"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                {titleCn}
              </Text>
              <Text
                className="text-xs font-bold text-[#5D3327]/80 mt-0.5"
                style={{ fontFamily: "Sora-Bold" }}
              >
                {titleEn}
              </Text>
            </View>

            {Boolean(dateStr) && (
              <View className="bg-amber-100/70 px-2.5 py-1 rounded-full border border-amber-200/80">
                <Text
                  className="text-[9px] font-bold text-[#8C6D38]"
                  style={{ fontFamily: "Sora-Bold" }}
                >
                  {dateStr}
                </Text>
              </View>
            )}
          </View>

          {/* Letter Content Paragraph Body */}
          <View className="py-4">
            {isLoading && !apiData && !params.content ? (
              <View className="py-8 items-center justify-center">
                <ActivityIndicator size="small" color="#F43F5E" />
                <Text
                  className="text-xs text-[#8C7B75] mt-2 font-bold"
                  style={{ fontFamily: "ZenMaruGothic-Medium" }}
                >
                  正在載入信件內容... Loading Letter...
                </Text>
              </View>
            ) : (
              <Text
                className="text-sm font-bold text-[#43160E] leading-7"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                {letterContent}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* 4. Bottom Action Pill Buttons (編輯 Edit | 刪除 Delete | 分享 Share) */}
      <View className="w-full flex-row items-center justify-between gap-2 mt-4">
        {/* Button 1: 編輯 Edit */}
        <TouchableOpacity
          onPress={handleEdit}
          activeOpacity={0.8}
          className="flex-1 bg-white py-3 px-2 rounded-full flex-row items-center justify-center gap-1.5 border border-[#F5E6CA]"
          style={styles.actionBtnShadow}
        >
          <Ionicons name="create-outline" size={17} color="#C08213" />
          <View className="items-start">
            <Text
              className="text-xs font-bold text-[#C08213] leading-none"
              style={{ fontFamily: "ZenMaruGothic-Bold" }}
            >
              編輯
            </Text>
            <Text
              className="text-[8px] font-bold text-[#C08213]/80 leading-none mt-0.5"
              style={{ fontFamily: "Sora-Bold" }}
            >
              Edit
            </Text>
          </View>
        </TouchableOpacity>

        {/* Button 2: 刪除 Delete */}
        <TouchableOpacity
          onPress={handleDelete}
          disabled={isDeleting}
          activeOpacity={0.8}
          className="flex-1 bg-white py-3 px-2 rounded-full flex-row items-center justify-center gap-1.5 border border-rose-200"
          style={styles.deleteBtnShadow}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#F43F5E" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={17} color="#F43F5E" />
              <View className="items-start">
                <Text
                  className="text-xs font-bold text-[#F43F5E] leading-none"
                  style={{ fontFamily: "ZenMaruGothic-Bold" }}
                >
                  刪除
                </Text>
                <Text
                  className="text-[8px] font-bold text-[#F43F5E]/80 leading-none mt-0.5"
                  style={{ fontFamily: "Sora-Bold" }}
                >
                  Delete
                </Text>
              </View>
            </>
          )}
        </TouchableOpacity>

        {/* Button 3: 分享 Share */}
        <TouchableOpacity
          onPress={handleShare}
          activeOpacity={0.8}
          className="flex-1 bg-white py-3 px-2 rounded-full flex-row items-center justify-center gap-1.5 border border-[#F5E6CA]"
          style={styles.actionBtnShadow}
        >
          <Ionicons name="share-outline" size={17} color="#C08213" />
          <View className="items-start">
            <Text
              className="text-xs font-bold text-[#C08213] leading-none"
              style={{ fontFamily: "ZenMaruGothic-Bold" }}
            >
              分享
            </Text>
            <Text
              className="text-[8px] font-bold text-[#C08213]/80 leading-none mt-0.5"
              style={{ fontFamily: "Sora-Bold" }}
            >
              Share
            </Text>
          </View>
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
  mascotShadow: {
    shadowColor: "#DCB978",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  airmailCardShadow: {
    shadowColor: "#F472B6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnShadow: {
    shadowColor: "#DCB978",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteBtnShadow: {
    shadowColor: "#F43F5E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default LetterDetailView;
