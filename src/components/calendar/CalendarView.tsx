import { useDiaries } from "@/hooks/useDiary";
import { useCalendarData } from "@/hooks/useHome";
import { CalendarBilingualDay } from "@/types";
import { getCalendarDayStatus } from "@/utils/calendar.utils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateDetailsCard, { DateNote } from "./DateDetailsCard";

// Sticker definitions with tags for searching
export interface StickerItem {
  id: string;
  emoji: string;
  name: string;
  tags: string[];
  bgColor: string;
}

export const STICKERS: StickerItem[] = [
  { id: "bear", emoji: "🧸", name: "Teddy", tags: ["bear", "teddy", "泰迪", "熊"], bgColor: "#FFFBF0" },
  { id: "cat", emoji: "🐱", name: "Cat", tags: ["cat", "kitty", "貓", "貓咪"], bgColor: "#FFF9EE" },
  { id: "dog", emoji: "🐶", name: "Dog", tags: ["dog", "puppy", "狗", "小狗"], bgColor: "#FFFDF0" },
  { id: "rabbit", emoji: "🐰", name: "Rabbit", tags: ["rabbit", "bunny", "兔", "兔子"], bgColor: "#FFF2F5" },
  { id: "fish", emoji: "🐟", name: "Fish", tags: ["fish", "魚", "小魚"], bgColor: "#F0F8FF" },
  { id: "bird", emoji: "🐥", name: "Chick", tags: ["chick", "bird", "雞", "小雞"], bgColor: "#FFFDF0" },
  { id: "book", emoji: "📖", name: "Book", tags: ["book", "read", "書", "閱讀"], bgColor: "#F5F3FF" },
  { id: "pencil", emoji: "✏️", name: "Pencil", tags: ["pencil", "write", "筆", "寫字"], bgColor: "#FFF7ED" },
  { id: "heart", emoji: "💖", name: "Heart", tags: ["heart", "love", "心", "愛心"], bgColor: "#FFF0F3" },
  { id: "star", emoji: "⭐", name: "Star", tags: ["star", "luck", "星", "星星"], bgColor: "#FFFBF0" },
  { id: "leaf", emoji: "🍃", name: "Leaf", tags: ["leaf", "green", "葉", "樹葉"], bgColor: "#F2FDF4" },
  { id: "flower", emoji: "🌸", name: "Flower", tags: ["flower", "sakura", "花", "櫻花"], bgColor: "#FFF2F5" },
  { id: "sparkles", emoji: "✨", name: "Sparkles", tags: ["sparkles", "shine", "閃爍", "亮晶晶"], bgColor: "#FFFBF0" },
  { id: "clover", emoji: "🍀", name: "Clover", tags: ["clover", "luck", "幸運草"], bgColor: "#F2FDF4" },
  { id: "coffee", emoji: "☕", name: "Coffee", tags: ["coffee", "drink", "咖啡"], bgColor: "#F9F6F0" },
  { id: "cake", emoji: "🍰", name: "Cake", tags: ["cake", "sweet", "蛋糕", "甜點"], bgColor: "#FFF2F5" },
];

// Weekday headers: Japanese/Chinese + English
const WEEKDAYS = [
  { zh: "日", en: "Sun", color: "text-[#E91E63]" },
  { zh: "月", en: "Mon", color: "text-[#5D3327]" },
  { zh: "火", en: "Tue", color: "text-[#5D3327]" },
  { zh: "水", en: "Wed", color: "text-[#5D3327]" },
  { zh: "木", en: "Thu", color: "text-[#5D3327]" },
  { zh: "金", en: "Fri", color: "text-[#5D3327]" },
  { zh: "土", en: "Sat", color: "text-[#0288D1]" },
];

const ENGLISH_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export interface CalendarDay {
  dayNum: number;
  lunar: string;
  isCurrentMonth: boolean;
  type?: "lucky" | "bad" | "today" | "normal";
  key: string;
  dayStatus?: CalendarBilingualDay | null;
}

export const CalendarView: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomPadding = 90 + (insets.bottom > 0 ? insets.bottom : 20);

  const params = useLocalSearchParams<{ stickerId?: string; dateKey?: string; emoji?: string }>();

  // Real active date state (defaults to real current Date)
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedSticker, setSelectedSticker] = useState<StickerItem | null>(null);
  const [placedStickers, setPlacedStickers] = useState<{ [dateKey: string]: string }>({});

  // Sticker search state
  const [stickerSearchQuery, setStickerSearchQuery] = useState<string>("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Selected date for details card
  const [selectedDateInfo, setSelectedDateInfo] = useState<{
    year: number;
    month: number;
    dayNum: number;
    dateKey: string;
  }>({
    year,
    month,
    dayNum: currentDate.getDate(),
    dateKey: `${year}-${month + 1}-${currentDate.getDate()}`,
  });

  // Handle incoming params from drag & drop in Home section
  useEffect(() => {
    if (params.dateKey) {
      const parts = params.dateKey.split("-");
      if (parts.length === 3) {
        const yr = parseInt(parts[0], 10);
        const mo = parseInt(parts[1], 10) - 1;
        const dy = parseInt(parts[2], 10);

        if (!isNaN(yr) && !isNaN(mo) && !isNaN(dy)) {
          setCurrentDate(new Date(yr, mo, dy));
          setSelectedDateInfo({
            year: yr,
            month: mo,
            dayNum: dy,
            dateKey: params.dateKey,
          });

          const emojiToPlace =
            params.emoji || STICKERS.find((s) => s.id === params.stickerId)?.emoji;
          if (emojiToPlace) {
            setPlacedStickers((prev) => ({
              ...prev,
              [params.dateKey!]: emojiToPlace,
            }));
          }
        }
      }
    }
  }, [params.dateKey, params.stickerId, params.emoji]);

  // 1. Fetch real diary entries from database via GET /diary/
  const {
    data: diariesRes,
    refetch: refetchDiaries,
    isRefetching: isDiariesRefetching,
  } = useDiaries();

  // 2. Fetch real calendar data from API via GET /daily-check-in/calendar/?year=YYYY&month=M
  const {
    data: calendarRes,
    isLoading: isCalendarLoading,
    refetch: refetchCalendar,
    isRefetching: isCalendarRefetching,
  } = useCalendarData({
    year,
    month: month + 1,
  });

  // Local optimistic overrides
  const [userNotes, setUserNotes] = useState<{ [dateKey: string]: DateNote }>({});

  const diaryList = useMemo(() => {
    if (Array.isArray((diariesRes as any)?.data)) return (diariesRes as any).data;
    if (Array.isArray(diariesRes)) return diariesRes;
    return [];
  }, [diariesRes]);

  // Map API diary entries by date keys
  const apiDiaryMap = useMemo(() => {
    const map: { [key: string]: DateNote } = {};
    diaryList.forEach((item: any) => {
      if (item?.date) {
        const parts = item.date.split("-");
        const formattedKey = item.date;
        const altKey =
          parts.length === 3
            ? `${parseInt(parts[0], 10)}-${parseInt(parts[1], 10)}-${parseInt(parts[2], 10)}`
            : "";

        const noteObj: DateNote = {
          note: item.note,
          zh: item.note,
          en: item.weekday_en ? `${item.weekday_en}, ${item.month_year || ""}` : "",
          id: item.id,
          icon: item.icon,
        };

        map[formattedKey] = noteObj;
        if (altKey) map[altKey] = noteObj;
      }
    });
    return map;
  }, [diaryList]);

  // Combine placed stickers with stickers from API
  const resolvedPlacedStickers = useMemo(() => {
    const combined = { ...placedStickers };
    diaryList.forEach((item: any) => {
      if (item?.date && item?.icon) {
        const parts = item.date.split("-");
        const altKey =
          parts.length === 3
            ? `${parseInt(parts[0], 10)}-${parseInt(parts[1], 10)}-${parseInt(parts[2], 10)}`
            : item.date;

        let emoji = "🐾";
        if (item.icon === "happy_cat" || item.icon === "cat") emoji = "🐱";
        else if (item.icon === "paw_print") emoji = "🐾";
        else {
          const match = STICKERS.find(
            (s) => s.id === item.icon || s.emoji === item.icon || s.tags.includes(item.icon)
          );
          if (match) emoji = match.emoji;
        }

        if (!combined[altKey]) {
          combined[altKey] = emoji;
        }
        if (!combined[item.date]) {
          combined[item.date] = emoji;
        }
      }
    });
    return combined;
  }, [diaryList, placedStickers]);

  // Filtered stickers based on search
  const filteredStickers = useMemo(() => {
    const q = stickerSearchQuery.trim().toLowerCase();
    if (!q) return STICKERS;
    return STICKERS.filter(
      (stk) =>
        stk.name.toLowerCase().includes(q) ||
        stk.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [stickerSearchQuery]);

  // Dynamic calendar generator populated with real API /daily-check-in/calendar/ data
  const calendarDays = useMemo(() => {
    const days: CalendarDay[] = [];
    const today = new Date();

    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    // 1. Previous month overflow days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      days.push({
        dayNum,
        lunar: "",
        isCurrentMonth: false,
        key: `prev-${dayNum}`,
      });
    }

    // 2. Real Current month days from API
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday =
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === d;

      // Extract day status from API
      const dayStatus = getCalendarDayStatus(calendarRes, year, month + 1, d);

      let type: "lucky" | "bad" | "today" | "normal" = "normal";
      if (isToday) {
        type = "today";
      } else if (dayStatus?.code === "lucky") {
        type = "lucky";
      } else if (dayStatus?.code === "bad_luck") {
        type = "bad";
      }

      // Real status text from API ("吉", "凶", "平")
      const lunar =
        dayStatus?.zh || (type === "lucky" ? "吉" : type === "bad" ? "凶" : "平");

      const dateKey = `${year}-${month + 1}-${d}`;

      days.push({
        dayNum: d,
        lunar,
        isCurrentMonth: true,
        type,
        key: dateKey,
        dayStatus,
      });
    }

    // 3. Next month overflow days
    const totalGridCells = Math.ceil(days.length / 7) * 7;
    const remainingCells = totalGridCells - days.length;
    for (let n = 1; n <= remainingCells; n++) {
      days.push({
        dayNum: n,
        lunar: "",
        isCurrentMonth: false,
        key: `next-${n}`,
      });
    }

    return days;
  }, [year, month, calendarRes]);

  // Group days into 7-day week rows
  const weeks = useMemo(() => {
    const rows: CalendarDay[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      rows.push(calendarDays.slice(i, i + 7));
    }
    return rows;
  }, [calendarDays]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDatePress = (item: CalendarDay) => {
    if (item.isCurrentMonth) {
      setSelectedDateInfo({
        year,
        month,
        dayNum: item.dayNum,
        dateKey: item.key,
      });
    }

    if (selectedSticker) {
      setPlacedStickers((prev) => {
        const next = { ...prev };
        if (next[item.key] === selectedSticker.emoji) {
          delete next[item.key];
        } else {
          next[item.key] = selectedSticker.emoji;
        }
        return next;
      });
    }
  };

  const currentSelectedDateKey = `${year}-${month + 1}-${selectedDateInfo.dayNum}`;
  const formattedFullKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDateInfo.dayNum).padStart(2, "0")}`;

  const currentSelectedNote =
    userNotes[selectedDateInfo.dateKey] ||
    userNotes[currentSelectedDateKey] ||
    userNotes[formattedFullKey] ||
    apiDiaryMap[selectedDateInfo.dateKey] ||
    apiDiaryMap[currentSelectedDateKey] ||
    apiDiaryMap[formattedFullKey] ||
    undefined;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      className="w-full"
      refreshControl={
        <RefreshControl
          refreshing={isDiariesRefetching || isCalendarRefetching}
          onRefresh={() => {
            refetchDiaries();
            refetchCalendar();
          }}
          tintColor="#DF4587"
          colors={["#DF4587"]}
        />
      }
    >
      {/* Outer Container with spacious layout */}
      <View className="w-full gap-5 p-3">
        {/* ================= CALENDAR MAIN CARD ================= */}
        <View className="w-full bg-white rounded-[28px] p-4 shadow-sm border border-[#F3E8D5]">
          {/* Header Bar */}
          <View className="flex-row items-center justify-between mb-4">
            {/* Left Title */}
            <View className="flex-row items-center gap-2.5">
              <View className="w-10 h-10 rounded-2xl bg-pink-50 items-center justify-center border border-pink-100">
                <Ionicons name="calendar-sharp" size={22} color="#DF4587" />
              </View>
              <View>
                <Text
                  className="text-base font-bold text-[#5D3327]"
                  style={{ fontFamily: "ZenMaruGothic-Bold" }}
                >
                  {year} 年曆
                </Text>
                <Text
                  className="text-[10px] text-[#A89F91] mt-0.5"
                  style={{ fontFamily: "Sora-Medium" }}
                >
                  {ENGLISH_MONTHS[month]} {year} Calendar
                </Text>
              </View>
            </View>

            {/* Right Month Switcher Controls */}
            <View className="flex-row items-center gap-1.5">
              <TouchableOpacity
                onPress={handlePrevMonth}
                className="w-8 h-8 rounded-full bg-pink-100/80 items-center justify-center active:opacity-80"
              >
                <Ionicons name="chevron-back" size={16} color="#DF4587" />
              </TouchableOpacity>

              <View className="bg-pink-100/90 px-3 py-1.5 rounded-full items-center min-w-[70px]">
                {isCalendarLoading && !calendarRes ? (
                  <ActivityIndicator size="small" color="#DF4587" />
                ) : (
                  <>
                    <Text
                      className="text-xs font-bold text-[#DF4587]"
                      style={{ fontFamily: "ZenMaruGothic-Bold" }}
                    >
                      {year}年{month + 1}月
                    </Text>
                    <Text
                      className="text-[7.5px] text-[#DF4587]/80 text-center mt-0.5"
                      style={{ fontFamily: "Sora-Medium" }}
                    >
                      {ENGLISH_MONTHS[month]}
                    </Text>
                  </>
                )}
              </View>

              <TouchableOpacity
                onPress={handleNextMonth}
                className="w-8 h-8 rounded-full bg-pink-100/80 items-center justify-center active:opacity-80"
              >
                <Ionicons name="chevron-forward" size={16} color="#DF4587" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Weekday Header Row */}
          <View className="flex-row bg-[#FFF0F5] py-2.5 rounded-2xl mb-2 border border-pink-100/50">
            {WEEKDAYS.map((day, idx) => (
              <View key={idx} className="flex-1 items-center justify-center">
                <Text
                  className={`text-[12px] font-bold ${day.color}`}
                  style={{ fontFamily: "ZenMaruGothic-Bold" }}
                >
                  {day.zh}
                </Text>
                <Text
                  className={`text-[8px] ${day.color} opacity-75 mt-0.5`}
                  style={{ fontFamily: "Sora-Medium" }}
                >
                  {day.en}
                </Text>
              </View>
            ))}
          </View>

          {/* Dates Grid Rows */}
          <View className="w-full">
            {weeks.map((week, weekIdx) => (
              <View key={weekIdx} className="flex-row w-full my-0.5">
                {week.map((item) => {
                  const userSticker = resolvedPlacedStickers[item.key];
                  const isSelected = selectedDateInfo.dateKey === item.key;

                  return (
                    <Pressable
                      key={item.key}
                      onPress={() => handleDatePress(item)}
                      className={`flex-1 h-[60px] items-center justify-center relative rounded-2xl mx-0.5 ${
                        isSelected
                          ? "bg-amber-100/50 border-2 border-[#DF4587]"
                          : "border border-transparent active:bg-pink-50/40"
                      }`}
                    >
                      {/* Today Circle Badge */}
                      {item.type === "today" ? (
                        <View className="w-11 h-11 rounded-full border-2 border-[#DF4587] items-center justify-center bg-pink-50/60 relative shadow-sm">
                          <Text
                            className="text-[7.5px] font-bold text-[#DF4587]"
                            style={{ fontFamily: "ZenMaruGothic-Bold" }}
                          >
                            {item.lunar}
                          </Text>
                          <Text
                            className="text-[12px] font-extrabold text-[#DF4587] -mt-0.5"
                            style={{ fontFamily: "Sora-Bold" }}
                          >
                            {item.dayNum}
                          </Text>
                          <View className="bg-[#DF4587] px-1 py-0.2 rounded-full absolute -bottom-2.5">
                            <Text className="text-[6px] text-white font-bold">
                              今天 Today
                            </Text>
                          </View>
                        </View>
                      ) : item.type === "lucky" ? (
                        /* Lucky Day Circle */
                        <View className="w-9 h-9 rounded-full bg-[#DF4587] items-center justify-center relative shadow-sm">
                          <Text
                            className="text-[7px] font-bold text-white/90"
                            style={{ fontFamily: "ZenMaruGothic-Bold" }}
                          >
                            {item.lunar}
                          </Text>
                          <Text
                            className="text-[11px] font-bold text-white -mt-0.5"
                            style={{ fontFamily: "Sora-Bold" }}
                          >
                            {item.dayNum}
                          </Text>
                        </View>
                      ) : item.type === "bad" ? (
                        /* Bad Luck Day Circle */
                        <View className="w-9 h-9 rounded-full bg-[#4A5568] items-center justify-center relative shadow-sm">
                          <Text
                            className="text-[7px] font-bold text-white/90"
                            style={{ fontFamily: "ZenMaruGothic-Bold" }}
                          >
                            {item.lunar}
                          </Text>
                          <Text
                            className="text-[11px] font-bold text-white -mt-0.5"
                            style={{ fontFamily: "Sora-Bold" }}
                          >
                            {item.dayNum}
                          </Text>
                        </View>
                      ) : (
                        /* Standard Normal Day */
                        <View className="items-center justify-center">
                          <Text
                            className={`text-[8px] font-medium ${
                              item.isCurrentMonth
                                ? "text-[#5D3327]"
                                : "text-[#B0BEC5]"
                            }`}
                            style={{ fontFamily: "ZenMaruGothic-Medium" }}
                          >
                            {item.lunar}
                          </Text>
                          <Text
                            className={`text-[12px] font-bold mt-0.5 ${
                              item.isCurrentMonth
                                ? "text-[#33221C]"
                                : "text-[#CFD8DC]"
                            }`}
                            style={{ fontFamily: "Sora-Bold" }}
                          >
                            {item.dayNum}
                          </Text>
                        </View>
                      )}

                      {/* User Placed Sticker Overlay */}
                      {userSticker && (
                        <Text className="absolute top-0 left-0 text-sm z-20">
                          {userSticker}
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Legend Bar Footer */}
          <View className="flex-row items-center justify-around pt-4 border-t border-slate-100 mt-3">
            <View className="flex-row items-center gap-1.5">
              <View className="w-3.5 h-3.5 rounded-full border-2 border-[#DF4587] bg-pink-50" />
              <Text
                className="text-xs font-bold text-[#5D3327]"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                今日 <Text className="text-[10px] font-normal text-slate-500">Today</Text>
              </Text>
            </View>

            <View className="flex-row items-center gap-1.5">
              <View className="w-3.5 h-3.5 rounded-full bg-[#DF4587]" />
              <Text
                className="text-xs font-bold text-[#5D3327]"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                吉日 <Text className="text-[10px] font-normal text-slate-500">Lucky</Text>
              </Text>
            </View>

            <View className="flex-row items-center gap-1.5">
              <View className="w-3.5 h-3.5 rounded-full bg-[#4A5568]" />
              <Text
                className="text-xs font-bold text-[#5D3327]"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                凶日 <Text className="text-[10px] font-normal text-slate-500">Bad</Text>
              </Text>
            </View>

            <View className="flex-row items-center gap-1.5">
              <Text className="text-xs">🐾</Text>
              <Text
                className="text-xs font-bold text-[#5D3327]"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                日誌 <Text className="text-[10px] font-normal text-slate-500">Diary</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* ================= SELECTED DATE FORTUNE DETAILS CARD ================= */}
        <DateDetailsCard
          selectedDate={selectedDateInfo}
          dayStatus={getCalendarDayStatus(
            calendarRes,
            selectedDateInfo.year,
            selectedDateInfo.month + 1,
            selectedDateInfo.dayNum
          )}
          note={currentSelectedNote}
          stickerId={
            currentSelectedNote?.icon ||
            (resolvedPlacedStickers[selectedDateInfo.dateKey] ||
            resolvedPlacedStickers[formattedFullKey]
              ? STICKERS.find(
                  (s) =>
                    s.emoji ===
                      (resolvedPlacedStickers[selectedDateInfo.dateKey] ||
                        resolvedPlacedStickers[formattedFullKey]) ||
                    s.id ===
                      (resolvedPlacedStickers[selectedDateInfo.dateKey] ||
                        resolvedPlacedStickers[formattedFullKey])
                )?.id || "happy_cat"
              : selectedSticker?.id || "happy_cat")
          }
          onSaveNote={(key, note) => {
            setUserNotes((prev) => ({ ...prev, [key]: note }));
          }}
        />

        {/* ================= STICKERS PALETTE DRAWER WITH SEARCH ================= */}
        <View className="w-full bg-[#FFFDF8] rounded-[28px] p-4 border-2 border-[#E5A93C]/40 shadow-sm">
          {/* Drawer Header */}
          <View className="flex-row items-center gap-2 mb-3">
            <Text className="text-lg">🐾</Text>
            <View className="flex-1">
              <Text
                className="text-xs font-bold text-[#C08213]"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                拖曳貼紙到日曆上使用
              </Text>
              <Text
                className="text-[9.5px] text-[#C08213]/80 mt-0.5"
                style={{ fontFamily: "Sora-Medium" }}
              >
                Search & tap a sticker, then tap any date to place it
              </Text>
            </View>
          </View>

          {/* Search Input Bar */}
          <View className="flex-row items-center bg-[#FFF9EE] px-3.5 py-2.5 rounded-2xl border border-[#E9D8B6] mb-3.5">
            <Ionicons name="search-outline" size={17} color="#C08213" style={{ marginRight: 8 }} />
            <TextInput
              value={stickerSearchQuery}
              onChangeText={setStickerSearchQuery}
              placeholder="搜尋貼紙... / Search stickers (e.g. cat, heart, star)..."
              placeholderTextColor="#A89F91"
              className="flex-1 text-xs text-[#5D3327] py-0"
              style={{ fontFamily: "ZenMaruGothic-Medium" }}
            />
            {stickerSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setStickerSearchQuery("")}>
                <Ionicons name="close-circle" size={17} color="#A89F91" />
              </TouchableOpacity>
            )}
          </View>

          {/* Grid of Sticker Tiles (5 per row) */}
          {filteredStickers.length > 0 ? (
            <View className="flex-row flex-wrap justify-between gap-y-3.5">
              {filteredStickers.map((stk) => {
                const isSelected = selectedSticker?.id === stk.id;
                return (
                  <TouchableOpacity
                    key={stk.id}
                    onPress={() => setSelectedSticker(isSelected ? null : stk)}
                    style={{
                      width: "18%",
                      aspectRatio: 1,
                      backgroundColor: stk.bgColor,
                      transform: [{ scale: isSelected ? 1.08 : 1 }],
                      shadowColor: isSelected ? "#DF4587" : "#D9C4A9",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: isSelected ? 0.5 : 0.4,
                      shadowRadius: 5,
                      elevation: isSelected ? 6 : 4,
                    }}
                    className={`rounded-[22px] items-center justify-center border ${isSelected
                        ? "border-2 border-[#DF4587]"
                        : "border-[#F5E6CA]"
                      }`}
                  >
                    <View className="w-full h-full items-center justify-center flex-1">
                      <Text className="text-2xl text-center leading-none">
                        {stk.emoji}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View className="py-6 items-center justify-center bg-amber-50/40 rounded-2xl border border-dashed border-amber-200">
              <Text className="text-xl mb-1">🔍</Text>
              <Text
                className="text-xs text-[#A89F91] font-bold"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                未找到相關貼紙 / No stickers found
              </Text>
            </View>
          )}

          {selectedSticker && (
            <View className="mt-3.5 p-2.5 bg-pink-50 rounded-2xl flex-row items-center justify-between border border-pink-100">
              <Text className="text-xs text-[#DF4587] font-bold">
                Active Sticker: {selectedSticker.emoji} {selectedSticker.name} (Tap date to apply)
              </Text>
              <TouchableOpacity onPress={() => setSelectedSticker(null)}>
                <Ionicons name="close-circle" size={18} color="#DF4587" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default CalendarView;
