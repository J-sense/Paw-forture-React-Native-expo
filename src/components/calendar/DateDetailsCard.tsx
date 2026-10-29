import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCreateDiary, useUpdateDiary } from "@/hooks/useDiary";
import { toast } from "burnt";

import { CalendarBilingualDay } from "@/types";

export interface DateNote {
  zh?: string;
  en?: string;
  note?: string;
  id?: number | string;
  icon?: string;
}

interface DateDetailsCardProps {
  selectedDate: {
    year: number;
    month: number; // 0-indexed
    dayNum: number;
    dateKey: string;
  };
  dayStatus?: CalendarBilingualDay | null;
  note?: DateNote;
  stickerId?: string;
  onSaveNote?: (dateKey: string, note: DateNote) => void;
}

const WEEKDAY_NAMES_ZH = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const WEEKDAY_NAMES_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const DateDetailsCard: React.FC<DateDetailsCardProps> = ({
  selectedDate,
  dayStatus,
  note,
  stickerId,
  onSaveNote,
}) => {
  const { year, month, dayNum, dateKey } = selectedDate;

  const dateObj = new Date(year, month, dayNum);
  const dayOfWeekIndex = dateObj.getDay();
  const weekdayZh = WEEKDAY_NAMES_ZH[dayOfWeekIndex];
  const weekdayEn = WEEKDAY_NAMES_EN[dayOfWeekIndex];

  // Diary creation & update mutations
  const { mutate: createDiary, isPending: isCreating } = useCreateDiary();
  const { mutate: updateDiary, isPending: isUpdating } = useUpdateDiary();
  const isSaving = isCreating || isUpdating;

  const hasNote = Boolean(note?.note || note?.zh || note?.en);
  const displayNoteText = note?.note || note?.zh || note?.en || "";

  // Edit Modal State
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editZh, setEditZh] = useState<string>("");
  const [editEn, setEditEn] = useState<string>("");

  const handleOpenEdit = () => {
    setEditZh(note?.zh || note?.note || "");
    setEditEn(note?.en || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (isSaving) return;

    const noteContent = editZh.trim() || editEn.trim();
    if (!noteContent) {
      toast({
        title: "Please write a note",
        message: "請輸入心得筆記內容。",
        preset: "error",
      });
      return;
    }

    const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const chosenIcon = stickerId || note?.icon || "happy_cat";
    const isEdit = Boolean(note?.id);

    if (isEdit && note?.id) {
      // ✏️ UPDATE NOTE: PATCH /diary/{id}/
      updateDiary(
        {
          id: note.id,
          payload: {
            icon: chosenIcon,
            date: formattedDate,
            note: noteContent,
          },
        },
        {
          onSuccess: (res: any) => {
            console.log("✅ Diary Updated Response:", res);
            toast({
              title: res?.message_eng || "Diary note updated successfully.",
              message: res?.message_chinese || "日记更新成功。",
              preset: "done",
              duration: 3,
            });

            if (onSaveNote) {
              onSaveNote(dateKey, {
                note: noteContent,
                zh: editZh || noteContent,
                en: editEn,
                id: res?.data?.id || note.id,
                icon: chosenIcon,
              });
            }
            setIsEditing(false);
          },
          onError: (error: any) => {
            if (error?.response?.status === 401) return;
            toast({
              title:
                error?.response?.data?.message_eng ||
                error?.message ||
                "Failed to update diary note",
              message: error?.response?.data?.message_chinese,
              preset: "error",
            });
          },
        }
      );
    } else {
      // ➕ CREATE NOTE: POST /diary/
      createDiary(
        {
          icon: chosenIcon,
          date: formattedDate,
          note: noteContent,
        },
        {
          onSuccess: (res: any) => {
            console.log("✅ Diary Created Response:", res);
            toast({
              title: res?.message_eng || "Diary note created successfully.",
              message: res?.message_chinese || "日记创建成功。",
              preset: "done",
              duration: 3,
            });

            if (onSaveNote) {
              onSaveNote(dateKey, {
                note: noteContent,
                zh: editZh || noteContent,
                en: editEn,
                id: res?.data?.id,
                icon: chosenIcon,
              });
            }
            setIsEditing(false);
          },
          onError: (error: any) => {
            if (error?.response?.status === 401) return;
            toast({
              title:
                error?.response?.data?.message_eng ||
                error?.message ||
                "Failed to save diary note",
              message: error?.response?.data?.message_chinese,
              preset: "error",
            });
          },
        }
      );
    }
  };

  return (
    <View className="w-full bg-[#F5E6CA] rounded-[26px] p-4 border border-[#E9D8B6] shadow-sm">
      {/* Top Header Row */}
      <View className="flex-row items-center justify-between mb-3">
        {/* Left: Heart Icon + Date Text */}
        <View className="flex-row items-center gap-2.5">
          <View className="w-9 h-9 rounded-full bg-pink-100 items-center justify-center border border-pink-200">
            <Text className="text-base">💖</Text>
          </View>
          <View>
            <Text
              className="text-lg font-bold text-[#5D3327]"
              style={{ fontFamily: "ZenMaruGothic-Bold" }}
            >
              {year}年{month + 1}月{dayNum}日
            </Text>
            <View className="flex-row items-center gap-2">
              <Text
                className="text-xs text-[#5D3327]/80 font-medium"
                style={{ fontFamily: "ZenMaruGothic-Medium" }}
              >
                {weekdayZh} {weekdayEn}
              </Text>
              {dayStatus && (
                <View
                  className={`px-2 py-0.5 rounded-full flex-row items-center gap-1 ${
                    dayStatus.code === "lucky"
                      ? "bg-amber-100/90 border border-amber-300"
                      : dayStatus.code === "bad_luck"
                      ? "bg-rose-100/90 border border-rose-300"
                      : "bg-emerald-100/90 border border-emerald-300"
                  }`}
                >
                  <Text className="text-[10px]">
                    {dayStatus.code === "lucky"
                      ? "✨"
                      : dayStatus.code === "bad_luck"
                      ? "⚠️"
                      : "🍃"}
                  </Text>
                  <Text
                    className={`text-[9.5px] font-bold ${
                      dayStatus.code === "lucky"
                        ? "text-amber-800"
                        : dayStatus.code === "bad_luck"
                        ? "text-rose-800"
                        : "text-emerald-800"
                    }`}
                    style={{ fontFamily: "ZenMaruGothic-Bold" }}
                  >
                    {dayStatus.status_zh || dayStatus.zh}{" "}
                    {dayStatus.status_en || dayStatus.en}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Right: Edit Button */}
        <TouchableOpacity
          onPress={handleOpenEdit}
          className="bg-white px-3.5 py-1.5 rounded-full border border-[#DFCEB3] flex-row items-center gap-1 shadow-sm active:opacity-80"
        >
          <Ionicons name="pencil" size={13} color="#C08213" />
          <Text
            className="text-xs font-bold text-[#C08213]"
            style={{ fontFamily: "ZenMaruGothic-Bold" }}
          >
            {hasNote ? "編輯 Edit" : "新增 + Add"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Body (Side-by-side) */}
      <View className="flex-row items-center gap-3 mt-1">
        {/* Left Note/Cat Illustration Card */}
        <View className="w-[125px] bg-[#FFF9ED] rounded-2xl p-3 border border-[#EFE2C7] relative justify-between items-center h-[130px] shadow-sm">
          {/* Peeking Cat Badge at top */}
          <View className="absolute -top-3 items-center">
            <Text className="text-xl">🐱</Text>
          </View>
          <View className="pt-2 items-center justify-center flex-1">
            <Text
              className="text-xs text-center font-bold text-[#7A4B3A] italic leading-tight"
              style={{ fontFamily: "ZenMaruGothic-Bold" }}
            >
              Be happy{"\n"}today too!
            </Text>
          </View>
          <View className="w-full flex-row items-center justify-between px-1">
            <Text className="text-xs">💕</Text>
            <Text className="text-xs">🐾</Text>
          </View>
        </View>

        {/* Right Note Display OR Empty State */}
        {hasNote ? (
          <View className="flex-1 bg-[#FFFDF7] rounded-2xl p-3.5 border border-[#EFE4D0] relative min-h-[130px] justify-between shadow-sm">
            {/* Paw Icon top right */}
            <View className="absolute top-2 right-2 opacity-40">
              <Text className="text-xs">🐾</Text>
            </View>

            <View>
              <Text
                className="text-xs font-bold text-[#5D3327] mb-1.5"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                今天的我：
              </Text>

              <Text
                className="text-[11.5px] font-medium text-[#5D3327] leading-relaxed mb-1"
                style={{ fontFamily: "ZenMaruGothic-Medium" }}
              >
                {displayNoteText}
              </Text>
            </View>

            {Boolean(note?.en && note?.zh && note.en !== note.zh) && (
              <Text
                className="text-[10px] text-[#7A6E5F] leading-tight"
                style={{ fontFamily: "Sora-Medium" }}
              >
                {note?.en}
              </Text>
            )}
          </View>
        ) : (
          <View className="flex-1 bg-[#FFFDF7] rounded-2xl p-3.5 border border-[#EFE4D0] relative min-h-[130px] justify-center items-center shadow-sm">
            <Text className="text-2xl mb-1">📝</Text>
            <Text
              className="text-xs font-bold text-[#5D3327] text-center"
              style={{ fontFamily: "ZenMaruGothic-Bold" }}
            >
              本日尚無日誌
            </Text>
            <Text
              className="text-[9.5px] text-[#A89F91] text-center mt-1 leading-4 px-1"
              style={{ fontFamily: "ZenMaruGothic-Medium" }}
            >
              點擊右上角「新增」記錄今天的心情吧！
            </Text>
          </View>
        )}
      </View>

      {/* Edit Modal */}
      <Modal
        visible={isEditing}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditing(false)}
      >
        <Pressable
          onPress={() => setIsEditing(false)}
          className="flex-1 bg-black/50 justify-center items-center p-4"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#FFFDF8] rounded-3xl p-5 border-2 border-[#E5A93C]/40 shadow-xl"
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text
                className="text-base font-bold text-[#5D3327]"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                ✏️ {hasNote ? "編輯日誌 / Edit Note" : "寫下今日心得 / Write Diary"}
              </Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Ionicons name="close-circle" size={22} color="#A89F91" />
              </TouchableOpacity>
            </View>

            <Text className="text-xs font-bold text-[#5D3327] mb-1">
              日誌心得 / Diary Note:
            </Text>
            <TextInput
              value={editZh}
              onChangeText={setEditZh}
              placeholder="寫下今天發生的小事或心情..."
              placeholderTextColor="#BDB4A8"
              multiline
              numberOfLines={4}
              className="w-full bg-[#FFF9EE] border border-[#E9D8B6] rounded-2xl p-3 text-xs text-[#5D3327] mb-3 min-h-[85px]"
              style={{ fontFamily: "ZenMaruGothic-Medium", textAlignVertical: "top" }}
            />

            {/* Action Buttons */}
            <View className="flex-row gap-3 mt-1">
              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                className="flex-1 bg-slate-100 py-2.5 rounded-full items-center"
              >
                <Text
                  className="text-xs font-bold text-slate-600"
                  style={{ fontFamily: "ZenMaruGothic-Bold" }}
                >
                  取消 Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={isSaving}
                className="flex-1 bg-[#DF4587] py-2.5 rounded-full items-center shadow-sm"
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text
                    className="text-xs font-bold text-white"
                    style={{ fontFamily: "ZenMaruGothic-Bold" }}
                  >
                    儲存 Save
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default DateDetailsCard;
