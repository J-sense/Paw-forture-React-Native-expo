import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AlarmItem } from "./AlarmCard";

interface AddAlarmModalProps {
  visible: boolean;
  onClose: () => void;
  onAddAlarm: (alarm: AlarmItem) => void;
}

export const AddAlarmModal: React.FC<AddAlarmModalProps> = ({
  visible,
  onClose,
  onAddAlarm,
}) => {
  const [time, setTime] = useState("08:30");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [titleZh, setTitleZh] = useState("起床伸懶腰");
  const [titleEn, setTitleEn] = useState("Wake Up & Stretch");
  const [repeat, setRepeat] = useState("每天 Every day");

  const handleSave = () => {
    const newAlarm: AlarmItem = {
      id: Date.now().toString(),
      time,
      period,
      titleZh: titleZh || "鬧鐘提醒",
      titleEn: titleEn || "Alarm Reminder",
      repeat: repeat || "每天 Every day",
      iconEmoji: "🐱⏰",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      enabled: true,
    };
    onAddAlarm(newAlarm);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-[#FFFDF9] rounded-t-[32px] p-5 border-t-2 border-[#E9D8B6]">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <View className="flex-row items-center gap-2">
              <Text className="text-xl">🐾</Text>
              <Text
                className="text-base font-bold text-[#5D3327]"
                style={{ fontFamily: "ZenMaruGothic-Bold" }}
              >
                新增鬧鐘 Add New Alarm
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={24} color="#A89F91" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="max-h-[380px]">
            {/* Time Input */}
            <View className="mb-3">
              <Text className="text-xs font-bold text-[#5D3327] mb-1.5">時間 / Time (HH:MM)</Text>
              <View className="flex-row items-center gap-2">
                <TextInput
                  value={time}
                  onChangeText={setTime}
                  placeholder="08:30"
                  className="flex-1 bg-white border border-[#E9D8B6] px-3.5 py-2.5 rounded-2xl text-base font-bold text-[#5D3327]"
                />
                <TouchableOpacity
                  onPress={() => setPeriod(period === "AM" ? "PM" : "AM")}
                  className="bg-[#D48B16] px-4 py-3 rounded-2xl"
                >
                  <Text className="text-white font-bold text-xs">{period}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Chinese Title */}
            <View className="mb-3">
              <Text className="text-xs font-bold text-[#5D3327] mb-1.5">中文標題 / Chinese Title</Text>
              <TextInput
                value={titleZh}
                onChangeText={setTitleZh}
                placeholder="例如：起床伸懶腰！"
                className="bg-white border border-[#E9D8B6] px-3.5 py-2.5 rounded-2xl text-xs text-[#5D3327]"
              />
            </View>

            {/* English Title */}
            <View className="mb-3">
              <Text className="text-xs font-bold text-[#5D3327] mb-1.5">英文標題 / English Title</Text>
              <TextInput
                value={titleEn}
                onChangeText={setTitleEn}
                placeholder="e.g. Wake Up & Stretch!"
                className="bg-white border border-[#E9D8B6] px-3.5 py-2.5 rounded-2xl text-xs text-[#5D3327]"
              />
            </View>

            {/* Repeat Days */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-[#5D3327] mb-1.5">重複 / Repeat</Text>
              <TextInput
                value={repeat}
                onChangeText={setRepeat}
                placeholder="例如：每天 Every day"
                className="bg-white border border-[#E9D8B6] px-3.5 py-2.5 rounded-2xl text-xs text-[#5D3327]"
              />
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <TouchableOpacity
            onPress={handleSave}
            className="w-full bg-[#D48B16] py-3.5 rounded-2xl items-center shadow-md active:opacity-90 mt-2"
          >
            <Text className="text-white font-bold text-sm" style={{ fontFamily: "ZenMaruGothic-Bold" }}>
              儲存鬧鐘 Save Alarm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddAlarmModal;
