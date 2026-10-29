import { useCalendarData } from "@/hooks/useHome";
import { getCalendarDayStatus } from "@/utils/calendar.utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { STICKERS, StickerItem } from "../calendar/CalendarView";

// ─── Constants ───────────────────────────────────────────────────
const MINI_WEEKDAYS = [
  { zh: "日", color: "#E91E63" },
  { zh: "月", color: "#5D3327" },
  { zh: "火", color: "#5D3327" },
  { zh: "水", color: "#5D3327" },
  { zh: "木", color: "#5D3327" },
  { zh: "金", color: "#5D3327" },
  { zh: "土", color: "#0288D1" },
];

const ENGLISH_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const PREVIEW_STICKERS = STICKERS.slice(0, 8);

// ─── Types ───────────────────────────────────────────────────────
export interface MiniCalendarDay {
  dayNum: number;
  lunar: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isLucky: boolean;
  isBad: boolean;
  key: string;
}

// ─── Draggable Sticker Component ─────────────────────────────────
interface DraggableStickerProps {
  sticker: StickerItem;
  onDragStart: () => void;
  onDragMove: (absX: number, absY: number) => void;
  onDragEnd: (absX: number, absY: number, sticker: StickerItem) => void;
}

const DraggableSticker: React.FC<DraggableStickerProps> = ({
  sticker,
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const zIdx = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      "worklet";
      zIdx.value = 100;
      scale.value = withSpring(1.35, { damping: 12 });
      runOnJS(onDragStart)();
    })
    .onUpdate((e) => {
      "worklet";
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      runOnJS(onDragMove)(e.absoluteX, e.absoluteY);
    })
    .onEnd((e) => {
      "worklet";
      runOnJS(onDragEnd)(e.absoluteX, e.absoluteY, sticker);
      translateX.value = withSpring(0, { damping: 15 });
      translateY.value = withSpring(0, { damping: 15 });
      scale.value = withSpring(1, { damping: 12 });
      zIdx.value = 1;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: zIdx.value,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          {
            width: "48%",
            aspectRatio: 1,
            backgroundColor: sticker.bgColor,
            shadowColor: "rgba(220,185,120,0.35)",
            shadowOffset: { width: 0, height: 2.8 },
            shadowOpacity: 0.35,
            shadowRadius: 5.6,
            elevation: 3,
          },
          animatedStyle,
        ]}
        className="rounded-xl border border-[#ECD5A0] items-center justify-center shadow-[0px_2.8px_5.6px_-1.4px_rgba(220,185,120,0.35)]"
      >
        <Text className="text-2xl text-center leading-none">{sticker.emoji}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

// ─── Main Component ──────────────────────────────────────────────
interface CalendarStickerSectionProps {
  onDragStateChange?: (isDragging: boolean) => void;
}

export const CalendarStickerSection: React.FC<CalendarStickerSectionProps> = ({
  onDragStateChange,
}) => {
  const router = useRouter();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const [dragging, setDragging] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<MiniCalendarDay | null>(null);
  const [placedStickers, setPlacedStickers] = useState<{ [dateKey: string]: string }>({});

  // 1. Fetch real calendar data from API via GET /daily-check-in/calendar/?year=YYYY&month=M
  const { data: calendarRes } = useCalendarData({
    year,
    month: month + 1,
  });

  // Container refs for hit-testing
  const gridViewRef = useRef<View>(null);
  const gridRectRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  // ─── Calendar data ───────────────────────────────────────────
  const calendarDays = useMemo(() => {
    const days: MiniCalendarDay[] = [];
    const today = new Date();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    // 1. Prev month overflow
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      days.push({
        dayNum,
        lunar: "",
        isCurrentMonth: false,
        isToday: false,
        isLucky: false,
        isBad: false,
        key: `prev-${dayNum}`,
      });
    }

    // 2. Current month from API
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday =
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === d;

      const dayStatus = getCalendarDayStatus(calendarRes, year, month + 1, d);
      const isLucky = dayStatus?.code === "lucky";
      const isBad = dayStatus?.code === "bad_luck";
      const lunar = dayStatus?.zh || (isLucky ? "吉" : isBad ? "凶" : "平");

      days.push({
        dayNum: d,
        lunar,
        isCurrentMonth: true,
        isToday,
        isLucky,
        isBad,
        key: `${year}-${month + 1}-${d}`,
      });
    }

    // 3. Next month overflow
    const totalGridCells = Math.ceil(days.length / 7) * 7;
    for (let n = 1; n <= totalGridCells - days.length; n++) {
      days.push({
        dayNum: n,
        lunar: "",
        isCurrentMonth: false,
        isToday: false,
        isLucky: false,
        isBad: false,
        key: `next-${n}`,
      });
    }
    return days;
  }, [year, month, calendarRes]);

  const weeks = useMemo(() => {
    const rows: MiniCalendarDay[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      rows.push(calendarDays.slice(i, i + 7));
    }
    return rows;
  }, [calendarDays]);

  // ─── Measure Calendar Grid Screen Rect ────────────────────────
  const updateGridRect = useCallback(() => {
    if (gridViewRef.current) {
      gridViewRef.current.measureInWindow((x, y, width, height) => {
        if (width > 0 && height > 0) {
          gridRectRef.current = { x, y, width, height };
        }
      });
    }
  }, []);

  // ─── Hit-test: compute grid cell from screen coords ──────────
  const getCellFromCoords = useCallback(
    (absX: number, absY: number): MiniCalendarDay | null => {
      const rect = gridRectRef.current;
      if (!rect || rect.width === 0 || rect.height === 0) return null;

      const relX = absX - rect.x;
      const relY = absY - rect.y;

      // Outside grid area
      if (relX < 0 || relX > rect.width || relY < 0 || relY > rect.height) {
        return null;
      }

      const col = Math.floor((relX / rect.width) * 7);
      const row = Math.floor((relY / rect.height) * weeks.length);

      const safeCol = Math.max(0, Math.min(6, col));
      const safeRow = Math.max(0, Math.min(weeks.length - 1, row));

      const day = weeks[safeRow]?.[safeCol];
      return day && day.isCurrentMonth ? day : null;
    },
    [weeks]
  );

  // ─── Drag Callbacks ──────────────────────────────────────────
  const handleDragStart = useCallback(() => {
    setDragging(true);
    onDragStateChange?.(true);
    updateGridRect();
  }, [onDragStateChange, updateGridRect]);

  const handleDragMove = useCallback(
    (absX: number, absY: number) => {
      const day = getCellFromCoords(absX, absY);
      setHoveredDay(day);
    },
    [getCellFromCoords]
  );

  const handleDragEnd = useCallback(
    (absX: number, absY: number, sticker: StickerItem) => {
      setDragging(false);
      setHoveredDay(null);
      onDragStateChange?.(false);

      const day = getCellFromCoords(absX, absY);

      if (day && day.isCurrentMonth) {
        // Place sticker in local mini calendar
        setPlacedStickers((prev) => ({ ...prev, [day.key]: sticker.emoji }));

        // Navigate to Calendar screen with dateKey and sticker info
        router.push({
          pathname: "/(tabs)/explore",
          params: { stickerId: sticker.id, emoji: sticker.emoji, dateKey: day.key },
        });
      }
    },
    [router, onDragStateChange, getCellFromCoords]
  );

  // ─── Date Click Navigation ────────────────────────────────────
  const handleDateClick = useCallback(
    (day: MiniCalendarDay) => {
      if (dragging) return;
      if (day.isCurrentMonth) {
        router.push({
          pathname: "/(tabs)/explore",
          params: { dateKey: day.key },
        });
      } else {
        router.push("/(tabs)/explore");
      }
    },
    [router, dragging]
  );

  // ─── Render Date Cell ────────────────────────────────────────
  const renderDateCell = useCallback(
    (item: MiniCalendarDay) => {
      const userSticker = placedStickers[item.key];
      const isHovered = hoveredDay?.key === item.key;
      const isValidTarget = item.isCurrentMonth && dragging;

      return (
        <Pressable
          key={item.key}
          onPress={() => handleDateClick(item)}
          className={`flex-1 items-center justify-center py-1 rounded-xl relative ${
            isHovered
              ? "bg-[#FFE4EC] border border-[#DF4587]"
              : "bg-transparent border-0"
          }`}
        >
          {item.isToday ? (
            <View
              key="today"
              className="w-[30px] h-[30px] rounded-full border-2 border-[#DF4587] items-center justify-center bg-pink-100/90"
              style={{ elevation: 2 }}
            >
              <Text
                className="text-[7.5px] font-bold text-[#DF4587]"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                {item.lunar}
              </Text>
              <Text
                className="text-[12.5px] font-extrabold text-[#DF4587] -mt-0.5"
                style={{ fontFamily: "Sora-Bold" }}
              >
                {item.dayNum}
              </Text>
            </View>
          ) : item.isLucky ? (
            <View
              key="lucky"
              className="w-[30px] h-[30px] rounded-full bg-[#DF4587] items-center justify-center"
              style={{ elevation: 2 }}
            >
              <Text
                className="text-[7.5px] font-bold text-white/95"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                {item.lunar}
              </Text>
              <Text
                className="text-[12.5px] font-extrabold text-white -mt-0.5"
                style={{ fontFamily: "Sora-Bold" }}
              >
                {item.dayNum}
              </Text>
            </View>
          ) : item.isBad ? (
            <View
              key="bad"
              className="w-[30px] h-[30px] rounded-full bg-[#4A5568] items-center justify-center"
              style={{ elevation: 2 }}
            >
              <Text
                className="text-[7.5px] font-bold text-white/95"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                {item.lunar}
              </Text>
              <Text
                className="text-[12.5px] font-extrabold text-white -mt-0.5"
                style={{ fontFamily: "Sora-Bold" }}
              >
                {item.dayNum}
              </Text>
            </View>
          ) : (
            <View key="normal" className="items-center justify-center w-[30px] h-[30px]">
              <Text
                className={`text-[8px] font-bold ${
                  item.isCurrentMonth ? "text-[#8D6E63]" : "text-[#CFD8DC]"
                }`}
                style={{ fontFamily: "ZenMaruGothic-Medium" }}
              >
                {item.lunar}
              </Text>
              <Text
                className={`text-[13px] font-extrabold -mt-0.5 ${
                  item.isCurrentMonth ? "text-[#3E2723]" : "text-[#CFD8DC]"
                }`}
                style={{ fontFamily: "Sora-Bold" }}
              >
                {item.dayNum}
              </Text>
            </View>
          )}

          {/* User Placed Sticker */}
          {userSticker && (
            <Text className="absolute -top-1 -right-0.5 text-xs z-40">
              {userSticker}
            </Text>
          )}
        </Pressable>
      );
    },
    [placedStickers, hoveredDay, dragging, handleDateClick]
  );

  // ─── JSX Render ──────────────────────────────────────────────
  return (
    <View className="w-full px-1 my-2.5">
      {/* Top Banner when hovering over date */}
      {hoveredDay && (
        <View className="items-center mb-2">
          <View className="bg-[#DF4587] px-4 py-1.5 rounded-full shadow-md elevation-4 flex-row items-center gap-1.5">
            <Ionicons name="location-sharp" size={14} color="#fff" />
            <Text className="text-xs text-white font-bold" style={{ fontFamily: "ZenMaruGothic-Bold" }}>
              放置到 {year}年{month + 1}月{hoveredDay.dayNum}日
            </Text>
          </View>
        </View>
      )}

      <View className="flex-row gap-2.5">
        {/* ========== LEFT: Mini Calendar Box ========== */}
        <View
          className={`flex-1 bg-[#FFFBF5] rounded-[22px] p-2.5 shadow-sm elevation-2 ${
            dragging ? "border-2 border-[#DF4587]" : "border border-[#F3E8D5]"
          }`}
        >
          {/* Header */}
          <Pressable
            onPress={() => router.push("/(tabs)/explore")}
            className="flex-row items-center justify-between mb-2"
          >
            <View className="flex-row items-center gap-1.5">
              <View className="w-7 h-7 rounded-xl bg-[#FFF0F5] items-center justify-center border border-[#FCE4EC]">
                <Ionicons name="calendar-sharp" size={15} color="#DF4587" />
              </View>
              <View>
                <Text className="text-xs text-[#5D3327] font-bold" style={{ fontFamily: "ZenMaruGothic-Bold" }}>
                  {year} 年曆
                </Text>
                <Text className="text-[7.5px] text-[#A89F91]" style={{ fontFamily: "Sora-Medium" }}>
                  {ENGLISH_MONTHS[month]} {year}
                </Text>
              </View>
            </View>
            <View className="bg-[#FCE4EC]/90 px-2.5 py-1 rounded-full">
              <Text className="text-[8.5px] text-[#DF4587] font-bold" style={{ fontFamily: "ZenMaruGothic-Bold" }}>
                {year}年{month + 1}月 ›
              </Text>
            </View>
          </Pressable>

          {/* Weekday Row */}
          <View className="flex-row mb-1 py-1 bg-[#FFF0F5]/50 rounded-lg">
            {MINI_WEEKDAYS.map((day, idx) => (
              <View key={idx} className="flex-1 items-center">
                <Text style={{ color: day.color }} className="text-[10px] font-bold">
                  {day.zh}
                </Text>
              </View>
            ))}
          </View>

          {/* Date Grid */}
          <View
            ref={gridViewRef}
            onLayout={updateGridRect}
            collapsable={false}
            className="w-full"
          >
            {weeks.map((week, weekIdx) => (
              <View key={weekIdx} className="flex-row w-full my-[1px]">
                {week.map((item) => renderDateCell(item))}
              </View>
            ))}
          </View>

          {/* Legend */}
          <View className="flex-row items-center justify-around mt-2 pt-1.5 border-t border-[#F3E8D5]">
            <View className="flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full border border-[#DF4587] bg-pink-100" />
              <Text className="text-[7.5px] text-[#5D3327] font-bold" style={{ fontFamily: "ZenMaruGothic-Bold" }}>
                今日 Today
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-[#DF4587]" />
              <Text className="text-[7.5px] text-[#5D3327] font-bold" style={{ fontFamily: "ZenMaruGothic-Bold" }}>
                吉日 Lucky
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-[#4A5568]" />
              <Text className="text-[7.5px] text-[#5D3327] font-bold" style={{ fontFamily: "ZenMaruGothic-Bold" }}>
                凶日 Bad
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-[#E0E0E0]" />
              <Text className="text-[7.5px] text-[#5D3327] font-bold" style={{ fontFamily: "ZenMaruGothic-Bold" }}>
                普通 Normal
              </Text>
            </View>
          </View>

          {/* Drag instruction notice */}
          {dragging && !hoveredDay && (
            <View className="items-center mt-1">
              <Text className="text-[7px] text-[#DF4587] font-bold" style={{ fontFamily: "ZenMaruGothic-Bold" }}>
                🎯 移動貼紙到日期上方放開 · Drop sticker on date
              </Text>
            </View>
          )}
        </View>

        {/* ========== RIGHT: Sticker Grid Box ========== */}
        <View className="w-28 bg-[#FFFBF2] rounded-[20px] border-[3px] border-orange-300 p-2 justify-between flex-col self-stretch shadow-md shadow-orange-300 elevation-3">
          {/* Sticker Tiles Grid (Fills 100% of height evenly) */}
          <View className="flex-1 justify-around py-1 mb-1 rounded-2xl bg-orange-50/70 border border-orange-100">
            {[0, 2, 4, 6].map((startIndex) => (
              <View key={startIndex} className="flex-row justify-between items-center w-full px-0.5">
                {PREVIEW_STICKERS.slice(startIndex, startIndex + 2).map((stk) => (
                  <DraggableSticker
                    key={stk.id}
                    sticker={stk}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </View>
            ))}
          </View>

          {/* Footer instruction */}
          <View className="items-center pt-1 pb-0.5 rounded-xl bg-orange-50 border border-orange-200">
            <Text className="text-xs mb-px">✨</Text>
            <Text className="text-[8px] text-center text-[#C08213] font-bold" style={{ fontFamily: "ZenMaruGothic-Bold" }}>
              拖曳貼紙使用
            </Text>
            <Text className="text-[7px] text-center text-[#C08213]/80 mt-px" style={{ fontFamily: "Sora-Medium" }}>
              Drag sticker onto date
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CalendarStickerSection;
