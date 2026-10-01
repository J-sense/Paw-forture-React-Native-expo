import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";

export default function HomeTab() {
  const router = useRouter();
  useRefreshOnFocus();

  return (
    <ScreenWrapper className="px-5">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
        {/* Header Banner */}
        <View className="bg-indigo-600 p-6 rounded-3xl mb-6 shadow-lg shadow-indigo-500/20">
          <Text className="text-white font-extrabold text-2xl">Welcome Back! 👋</Text>
          <Text className="text-indigo-100 mt-1 text-sm leading-5">
            Your Expo Router 4-Tab Navigation setup is active and running cleanly.
          </Text>
        </View>

        {/* Quick Stats Grid */}
        <Text className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-3">
          Overview
        </Text>
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-slate-800 p-4 rounded-2xl border border-slate-700/50">
            <Text className="text-slate-400 text-xs font-medium">Tabs Active</Text>
            <Text className="text-white font-bold text-xl mt-1">4 Screens</Text>
          </View>
          <View className="flex-1 bg-slate-800 p-4 rounded-2xl border border-slate-700/50">
            <Text className="text-slate-400 text-xs font-medium">Styling</Text>
            <Text className="text-emerald-400 font-bold text-xl mt-1">NativeWind v4</Text>
          </View>
        </View>

        {/* Feature List */}
        <Text className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-3">
          Starter Features
        </Text>
        <View className="bg-slate-800 p-5 rounded-2xl border border-slate-700/50 gap-4 mb-6">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-indigo-500/20 items-center justify-center mr-3">
              <Text className="text-indigo-400 text-sm font-bold">1</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-sm">Tab Navigation Layout</Text>
              <Text className="text-slate-400 text-xs">Home, Explore, Notifications, Profile</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-indigo-500/20 items-center justify-center mr-3">
              <Text className="text-indigo-400 text-sm font-bold">2</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-sm">Focus Refetching</Text>
              <Text className="text-slate-400 text-xs">Auto-refetches data when tab gains focus</Text>
            </View>
          </View>
        </View>

        <Button
          title="Explore Features"
          onPress={() => alert("Explore tab functionality is ready!")}
        />
        <Button
          title="View Information Screen"
          variant="outline"
          onPress={() => router.push("/info")}
          className="mt-4"
        />
      </ScrollView>
    </ScreenWrapper>
  );
}
