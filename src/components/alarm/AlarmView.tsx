import {
  cancelAlarm,
  configureAlarmChannel,
  ensureNotificationPermission,
  scheduleAlarm,
  syncAlarms,
} from "@/utils/alarmScheduler";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddAlarmView } from "./AddAlarmView";
import { AlarmCard, AlarmItem } from "./AlarmCard";
import { AlarmHeader } from "./AlarmHeader";
import { useCreateAlarm, useAlarms, useDeleteAlarm } from "@/hooks/useAlarm";
import { toast } from "burnt";

// Configure how notifications present when app is open (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const AlarmView: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomPadding = 90 + (insets.bottom > 0 ? insets.bottom : 16);

  // View state: "list" (alarm list) or "add" (add alarm form)
  const [mode, setMode] = useState<"list" | "add">("list");

  // React Query mutations and queries for alarms
  const { mutate: createAlarm, isPending: isCreating } = useCreateAlarm();
  const { mutate: deleteAlarm } = useDeleteAlarm();
  const { data: alarmsResponse, isLoading, refetch, isRefetching } = useAlarms();

  // Alarms state populated purely from backend API
  const [alarms, setAlarms] = useState<AlarmItem[]>([]);

  // On mount: ask permission, create the melody channel, then rebuild the schedule
  // so it always mirrors the alarm list (no stale or duplicate notifications).
  useEffect(() => {
    async function setUpAlarms() {
      try {
        const granted = await ensureNotificationPermission();
        if (!granted) {
          console.warn("Notification permissions not granted!");
          return;
        }
        await configureAlarmChannel();
        await syncAlarms(alarms);
      } catch (error) {
        console.error("Failed to set up alarms:", error);
      }
    }

    setUpAlarms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync alarms from backend when available
  useEffect(() => {
    if (alarmsResponse?.data && Array.isArray(alarmsResponse.data)) {
      console.log("⏰ [Synced Alarms from Backend]:", alarmsResponse.data);
      setAlarms(alarmsResponse.data);
      syncAlarms(alarmsResponse.data);
    }
  }, [alarmsResponse]);

  const handleToggleAlarm = async (id: string, value: boolean) => {
    const target = alarms.find((item) => item.id === id);
    if (!target) return;

    const updated = { ...target, enabled: value };
    setAlarms((prev) => prev.map((item) => (item.id === id ? updated : item)));

    try {
      if (value) {
        await scheduleAlarm(updated);
      } else {
        await cancelAlarm(id);
      }
    } catch (error) {
      console.error(`Error updating alarm ${id}:`, error);
    }
  };

  const handleDeleteAlarm = (id: string) => {
    Alert.alert(
      "刪除鬧鐘 Delete Alarm",
      "確定要刪除此鬧鐘嗎？ Are you sure you want to delete this alarm?",
      [
        { text: "取消 Cancel", style: "cancel" },
        {
          text: "刪除 Delete",
          style: "destructive",
          onPress: () => {
            // Cancel notification on device
            cancelAlarm(id).catch(() => {});

            // Optimistically remove from state
            setAlarms((prev) => prev.filter((a) => a.id !== id));

            // Call DELETE /daily-check-in/alarms/{id}/
            deleteAlarm(id, {
              onSuccess: (res: any) => {
                console.log("✅ Delete Alarm Success:", res);
                toast({
                  title: res?.message_eng || "Alarm deleted successfully.",
                  message: res?.message_chinese || "闹钟已成功删除。",
                  preset: "done",
                  duration: 3,
                });
              },
              onError: (error: any) => {
                console.error("❌ Delete Alarm Error:", error);
                toast({
                  title:
                    error?.response?.data?.message_eng ||
                    error?.message ||
                    "Failed to delete alarm",
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

  const handleAddAlarm = async (newAlarm: AlarmItem) => {
    createAlarm(
      {
        time: newAlarm.time,
        period: newAlarm.period,
        titleZh: newAlarm.titleZh,
        titleEn: newAlarm.titleEn,
        repeat: newAlarm.repeat,
        iconEmoji: newAlarm.iconEmoji || "🌅🐱",
        bgColor: newAlarm.bgColor || "bg-pink-50",
        borderColor: newAlarm.borderColor || "border-pink-200",
        enabled: newAlarm.enabled,
        days: newAlarm.days,
        note: newAlarm.note,
      },
      {
        onSuccess: async (res) => {
          console.log("✅ Create Alarm API Success:", res);
          toast({
            title: res?.message_eng || "Alarm created successfully.",
            message: res?.message_chinese || "闹钟创建成功。",
            preset: "done",
            duration: 3,
          });

          const createdItem: AlarmItem = {
            ...newAlarm,
            id: res?.data?.id ? String(res.data.id) : newAlarm.id,
            ...(res?.data || {}),
          };

          setAlarms((prev) => [createdItem, ...prev]);
          setMode("list");

          if (createdItem.enabled) {
            try {
              await scheduleAlarm(createdItem);
            } catch (err) {
              console.error(`Error scheduling alarm ${createdItem.id}:`, err);
            }
          }
        },
        onError: async (error: any) => {
          console.error("❌ Failed to create alarm on backend:", error);
          toast({
            title:
              error?.response?.data?.message_eng ||
              error?.message ||
              "Failed to save alarm to server",
            message: error?.response?.data?.message_chinese,
            preset: "error",
          });

          // Fallback: preserve alarm locally so user never loses their alarm
          setAlarms((prev) => [newAlarm, ...prev]);
          setMode("list");
          if (newAlarm.enabled) {
            try {
              await scheduleAlarm(newAlarm);
            } catch (err) {
              console.error(`Error scheduling alarm locally ${newAlarm.id}:`, err);
            }
          }
        },
      }
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      className="w-full"
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor="#DF4587"
          colors={["#DF4587"]}
        />
      }
    >
      <View className="w-full px-3">
        {/* Top Shared Header & Hero Banner */}
        <AlarmHeader
          onBackPress={mode === "add" ? () => setMode("list") : undefined}
        />

        {/* Changeable Content Section */}
        {mode === "list" ? (
          /* Main Alarms List Container Card */
          <View className="w-full bg-white my-4 -mt-5 rounded-[28px] p-4 border border-[#F3E8D5] shadow-sm">
            {/* Card Section Header */}
            <View className="flex-row items-center justify-between mb-4">
              {/* Left Title */}
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center border border-amber-200">
                  <Text className="text-sm">🐾</Text>
                </View>
                <View className="flex-row items-baseline gap-1.5">
                  <Text
                    className="text-base font-bold text-[#5D3327]"
                    style={{ fontFamily: "ZenMaruGothic-Bold" }}
                  >
                    我的鬧鐘
                  </Text>
                  <Text
                    className="text-xs text-[#A89F91]"
                    style={{ fontFamily: "Sora-Medium" }}
                  >
                    My Alarms
                  </Text>
                </View>
              </View>

              {/* Right Add Alarm Button (+ 新增鬧鐘 Add Alarm) */}
              <TouchableOpacity
                onPress={() => setMode("add")}
                className="px-3 py-1.5 bg-[#B66B20] rounded-full flex-row items-center justify-start shadow-sm active:opacity-90"
                style={{
                  shadowColor: "rgba(0,0,0,0.05)",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <Text className="text-center text-white text-sm font-black leading-4">+</Text>
                <Text
                  className="text-center text-white text-xs font-bold leading-4 pl-1"
                  style={{ fontFamily: "ZenMaruGothic-Bold" }}
                >
                  新增鬧鐘
                </Text>
                <Text
                  className="text-center text-white/90 text-xs font-medium leading-4 pl-1"
                  style={{ fontFamily: "Sora-Medium" }}
                >
                  Add Alarm
                </Text>
              </TouchableOpacity>
            </View>

            {/* Alarm List Items */}
            <View className="w-full">
              {isLoading && alarms.length === 0 ? (
                <View className="py-12 items-center justify-center">
                  <ActivityIndicator size="small" color="#B66B20" />
                  <Text
                    className="text-xs text-[#A89F91] mt-2 font-medium"
                    style={{ fontFamily: "ZenMaruGothic-Medium" }}
                  >
                    載入鬧鐘中 Loading alarms...
                  </Text>
                </View>
              ) : alarms.length === 0 ? (
                <View className="py-10 items-center justify-center">
                  <Text className="text-3xl mb-2">⏰</Text>
                  <Text
                    className="text-sm font-bold text-[#5D3327]"
                    style={{ fontFamily: "ZenMaruGothic-Bold" }}
                  >
                    尚未設定任何鬧鐘
                  </Text>
                  <Text
                    className="text-xs text-[#A89F91] mt-1"
                    style={{ fontFamily: "Sora-Medium" }}
                  >
                    No alarms set yet
                  </Text>
                  <TouchableOpacity
                    onPress={() => setMode("add")}
                    className="mt-4 px-4 py-2 bg-amber-100 rounded-full border border-amber-200 active:opacity-80"
                  >
                    <Text
                      className="text-xs font-bold text-[#B66B20]"
                      style={{ fontFamily: "ZenMaruGothic-Bold" }}
                    >
                      + 點此新增鬧鐘 Add Alarm
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                alarms.map((alarm) => (
                  <AlarmCard
                    key={alarm.id}
                    alarm={alarm}
                    onToggle={handleToggleAlarm}
                    onDelete={handleDeleteAlarm}
                  />
                ))
              )}
            </View>
          </View>
        ) : (
          /* Add Alarm Form Screen View (100% Figma Match) */
          <AddAlarmView
            onSave={handleAddAlarm}
            onCancel={() => setMode("list")}
            isSaving={isCreating}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default AlarmView;