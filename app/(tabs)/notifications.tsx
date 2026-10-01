import React from "react";
import { Text, View, ScrollView } from "react-native";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";

export default function NotificationsTab() {
  useRefreshOnFocus();

  const alerts = [
    { title: "Project Configured", time: "Just now", desc: "Expo Router 4-Tab navigation is now live.", icon: "checkmark-circle-outline", color: "text-emerald-400" },
    { title: "NativeWind Active", time: "10m ago", desc: "Tailwind CSS styling is scanning app & src directories.", icon: "sparkles-outline", color: "text-indigo-400" },
    { title: "TanStack Query Provider", time: "1h ago", desc: "QueryClient & network status listener initialized.", icon: "wifi-outline", color: "text-cyan-400" },
  ];

  return (
    <ScreenWrapper className="px-5">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
        <Text className="text-2xl font-bold text-white mb-2">Notifications 🔔</Text>
        <Text className="text-slate-400 text-sm mb-5">Stay updated with system & activity alerts.</Text>

        <View className="gap-3">
          {alerts.map((item, index) => (
            <View
              key={index}
              className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 flex-row items-start"
            >
              <View className="w-10 h-10 rounded-xl bg-slate-700/50 items-center justify-center mr-3 mt-1">
                <Ionicons name={item.icon as any} size={22} color="#6366f1" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-white font-semibold text-base">{item.title}</Text>
                  <Text className="text-slate-500 text-xs">{item.time}</Text>
                </View>
                <Text className="text-slate-400 text-xs leading-5">{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
