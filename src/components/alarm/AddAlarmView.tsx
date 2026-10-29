import { CustomToggleSwitch } from "@/components/ui/CustomToggleSwitch";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AlarmItem } from "./AlarmCard";

interface AddAlarmViewProps {
  onSave: (alarm: AlarmItem) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const DAYS = [
  { zh: "週一", en: "Mon", key: "Mon" },
  { zh: "週二", en: "Tue", key: "Tue" },
  { zh: "週三", en: "Wed", key: "Wed" },
  { zh: "週四", en: "Thu", key: "Thu" },
  { zh: "週五", en: "Fri", key: "Fri" },
  { zh: "週六", en: "Sat", key: "Sat" },
  { zh: "週日", en: "Sun", key: "Sun" },
];

const ICONS = [
  { id: "cat", emoji: "🐱", iconName: "paw-outline" },
  { id: "sun", emoji: "☀️", iconName: "sunny-outline" },
  { id: "coffee", emoji: "☕", iconName: "cafe-outline" },
  { id: "book", emoji: "📖", iconName: "book-outline" },
  { id: "moon", emoji: "🌙", iconName: "moon-outline" },
];

export const AddAlarmView: React.FC<AddAlarmViewProps> = ({
  onSave,
  onCancel,
  isSaving = false,
}) => {
  const [titleZh, setTitleZh] = useState("");
  const [timeHour, setTimeHour] = useState("07");
  const [timeMinute, setTimeMinute] = useState("00");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [selectedIcon, setSelectedIcon] = useState("cat");
  const [note, setNote] = useState("");
  const [enabled, setEnabled] = useState(true);

  const toggleDay = (key: string) => {
    setSelectedDays((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    );
  };

  // Keep digits only while typing, then clamp + zero-pad when leaving the field
  const sanitize = (text: string) => text.replace(/[^0-9]/g, "").slice(0, 2);
  const normalizeHour = (value: string) => {
    const n = Math.min(12, Math.max(1, parseInt(value, 10) || 12));
    return n.toString().padStart(2, "0");
  };
  const normalizeMinute = (value: string) => {
    const n = Math.min(59, Math.max(0, parseInt(value, 10) || 0));
    return n.toString().padStart(2, "0");
  };

  const handleSave = () => {
    const iconObj = ICONS.find((i) => i.id === selectedIcon) || ICONS[0];
    const repeatStr =
      selectedDays.length === 7
        ? "每天 Every day"
        : selectedDays.length === 5 && !selectedDays.includes("Sat") && !selectedDays.includes("Sun")
          ? "週一 週二 週三 週四 週五 Mon Tue Wed Thu Fri"
          : selectedDays.length > 0
            ? selectedDays.join(" ")
            : "單次 Single";

    const hour = normalizeHour(timeHour);
    const minute = normalizeMinute(timeMinute);

    const newAlarm: AlarmItem = {
      id: Date.now().toString(),
      time: `${hour}:${minute}`,
      period,
      titleZh: titleZh || "起床囉！",
      titleEn: titleZh ? `${titleZh}!` : "Wake Up!",
      repeat: repeatStr,
      iconEmoji: iconObj.emoji,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      enabled,
      days: selectedDays,
      note: note.trim() || undefined,
    };

    onSave(newAlarm);
  };

  return (
    <View className="w-full bg-white my-4 -mt-5 rounded-[28px] p-5 border border-[#F3E8D5] shadow-sm">
      {/* 1. 鬧鐘標題 Alarm Title */}
      <View className="mb-5">
        <View className="flex-row items-baseline gap-1.5 mb-2">
          <Text
            className="text-sm font-bold text-[#5D3327]"
            style={{ fontFamily: "ZenMaruGothic-Bold" }}
          >
            鬧鐘標題
          </Text>
          <Text
            className="text-xs text-[#A89F91]"
            style={{ fontFamily: "Sora-Medium" }}
          >
            Alarm Title
          </Text>
        </View>

        <View className="bg-[#FFFDF9] border border-[#F5E6CA] rounded-2xl px-4 py-3 flex-row items-center justify-between">
          <TextInput
            value={titleZh}
            onChangeText={setTitleZh}
            placeholder="例如：起床囉！"
            placeholderTextColor="#A89F91"
            maxLength={20}
            className="flex-1 text-sm text-[#5D3327] py-0"
            style={{ fontFamily: "ZenMaruGothic-Medium" }}
          />
          <Text
            className="text-[10px] text-[#C08213]/60 ml-2"
            style={{ fontFamily: "Sora-Medium" }}
          >
            {titleZh.length}/20
          </Text>
        </View>
      </View>

      {/* 2. 時間設定 Time */}
      <View className="mb-5">
        <View className="flex-row items-baseline gap-1.5 mb-2">
          <Text
            className="text-sm font-bold text-[#5D3327]"
            style={{ fontFamily: "ZenMaruGothic-Bold" }}
          >
            時間設定
          </Text>
          <Text
            className="text-xs text-[#A89F91]"
            style={{ fontFamily: "Sora-Medium" }}
          >
            Time
          </Text>
        </View>

        <View className="bg-[#FFFDF9] border border-[#F5E6CA] rounded-2xl px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <TextInput
              value={timeHour}
              onChangeText={(t) => setTimeHour(sanitize(t))}
              onBlur={() => setTimeHour(normalizeHour(timeHour))}
              keyboardType="number-pad"
              maxLength={2}
              selectTextOnFocus
              className="text-xl font-bold text-[#5D3327] py-0 px-2 min-w-[44px] text-center bg-amber-50 rounded-lg"
              style={{ fontFamily: "Sora-Bold" }}
            />
            <Text
              className="text-xl font-bold text-[#5D3327]"
              style={{ fontFamily: "Sora-Bold" }}
            >
              :
            </Text>
            <TextInput
              value={timeMinute}
              onChangeText={(t) => setTimeMinute(sanitize(t))}
              onBlur={() => setTimeMinute(normalizeMinute(timeMinute))}
              keyboardType="number-pad"
              maxLength={2}
              selectTextOnFocus
              className="text-xl font-bold text-[#5D3327] py-0 px-2 min-w-[44px] text-center bg-amber-50 rounded-lg"
              style={{ fontFamily: "Sora-Bold" }}
            />
            <TouchableOpacity
              onPress={() => setPeriod(period === "AM" ? "PM" : "AM")}
              className="ml-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200"
            >
              <Text
                className="text-sm font-bold text-[#C08213]"
                style={{ fontFamily: "Sora-Bold" }}
              >
                {period}
              </Text>
            </TouchableOpacity>
          </View>
          <Ionicons name="time-outline" size={18} color="#A89F91" />
        </View>
      </View>

      {/* 3. 重複 Repeat */}
      <View className="mb-5">
        <View className="flex-row items-baseline gap-1.5 mb-2">
          <Text
            className="text-sm font-bold text-[#5D3327]"
            style={{ fontFamily: "ZenMaruGothic-Bold" }}
          >
            重複
          </Text>
          <Text
            className="text-xs text-[#A89F91]"
            style={{ fontFamily: "Sora-Medium" }}
          >
            Repeat
          </Text>
        </View>

        <View className="flex-row justify-between gap-1">
          {DAYS.map((day) => {
            const isSelected = selectedDays.includes(day.key);
            return (
              <TouchableOpacity
                key={day.key}
                onPress={() => toggleDay(day.key)}
                className={`flex-1 py-2 rounded-xl items-center justify-center border ${isSelected
                    ? "bg-[#D48B16] border-[#D48B16]"
                    : "bg-[#FFFDF9] border-[#F5E6CA]"
                  }`}
              >
                <Text
                  className={`text-[11px] font-bold ${isSelected ? "text-white" : "text-[#5D3327]"
                    }`}
                  style={{ fontFamily: "ZenMaruGothic-Bold" }}
                >
                  {day.zh}
                </Text>
                <Text
                  className={`text-[8px] mt-0.5 ${isSelected ? "text-white/90" : "text-[#A89F91]"
                    }`}
                  style={{ fontFamily: "Sora-Medium" }}
                >
                  {day.en}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 4. 選擇圖示 Alarm Icon */}
      <View className="mb-5">
        <View className="flex-row items-baseline gap-1.5 mb-2">
          <Text
            className="text-sm font-bold text-[#5D3327]"
            style={{ fontFamily: "ZenMaruGothic-Bold" }}
          >
            選擇圖示
          </Text>
          <Text
            className="text-xs text-[#A89F91]"
            style={{ fontFamily: "Sora-Medium" }}
          >
            Alarm Icon
          </Text>
        </View>

        <View className="flex-row justify-between items-center gap-2">
          {ICONS.map((icon) => {
            const isSelected = selectedIcon === icon.id;
            return (
              <TouchableOpacity
                key={icon.id}
                onPress={() => setSelectedIcon(icon.id)}
                className={`w-12 h-12 rounded-2xl items-center justify-center border relative ${isSelected
                    ? "bg-amber-50 border-2 border-[#D48B16]"
                    : "bg-[#FFFDF9] border-[#F5E6CA]"
                  }`}
              >
                <Text className="text-xl">{icon.emoji}</Text>
                {isSelected && (
                  <View className="w-4 h-4 rounded-full bg-[#D48B16] absolute -top-1 -right-1 items-center justify-center border border-white">
                    <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 5. 備註（選填） Note (Optional) */}
      <View className="mb-5">
        <View className="flex-row items-baseline gap-1.5 mb-2">
          <Text
            className="text-sm font-bold text-[#5D3327]"
            style={{ fontFamily: "ZenMaruGothic-Bold" }}
          >
            備註（選填）
          </Text>
          <Text
            className="text-xs text-[#A89F91]"
            style={{ fontFamily: "Sora-Medium" }}
          >
            Note (Optional)
          </Text>
        </View>

        <View className="bg-[#FFFDF9] border border-[#F5E6CA] rounded-2xl p-3.5 min-h-[70px]">
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="寫下小提醒... Add a note..."
            placeholderTextColor="#A89F91"
            multiline
            className="text-xs text-[#5D3327] py-0"
            style={{ fontFamily: "ZenMaruGothic-Medium" }}
          />
        </View>
      </View>

      {/* 6. 鬧鐘開關 Alarm Switch */}
      <View className="flex-row items-center justify-between mb-6 pt-1">
        <View>
          <Text
            className="text-sm font-bold text-[#5D3327]"
            style={{ fontFamily: "ZenMaruGothic-Bold" }}
          >
            鬧鐘開關
          </Text>
          <Text
            className="text-xs text-[#A89F91]"
            style={{ fontFamily: "Sora-Medium" }}
          >
            Alarm Switch
          </Text>
        </View>

        <CustomToggleSwitch
          value={enabled}
          onValueChange={setEnabled}
        />
      </View>

      {/* 7. Action Buttons */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={onCancel}
          className="flex-1 bg-slate-100 py-3.5 rounded-2xl items-center border border-slate-200 active:opacity-80"
        >
          <Text
            className="text-sm font-bold text-slate-600"
            style={{ fontFamily: "ZenMaruGothic-Bold" }}
          >
            取消 Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          className="flex-1 bg-[#D48B16] py-3.5 rounded-2xl items-center justify-center shadow-md active:opacity-90"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text
              className="text-sm font-bold text-white"
              style={{ fontFamily: "ZenMaruGothic-Bold" }}
            >
              完成設定 Save
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddAlarmView;
