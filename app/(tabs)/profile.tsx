import React from "react";
import { Text, View, ScrollView } from "react-native";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { Button } from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";

export default function ProfileTab() {
  useRefreshOnFocus();

  return (
    <ScreenWrapper className="px-5">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
        {/* User Profile Header */}
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-indigo-600/30 border-2 border-indigo-500 items-center justify-center mb-3">
            <Ionicons name="person" size={48} color="#818cf8" />
          </View>
          <Text className="text-white font-bold text-xl">Developer User</Text>
          <Text className="text-slate-400 text-sm">dev@example.com</Text>
        </View>

        {/* Profile Settings Options */}
        <Text className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-3">
          Account Settings
        </Text>

        <View className="bg-slate-800 rounded-2xl border border-slate-700/50 overflow-hidden mb-6">
          <View className="p-4 flex-row items-center justify-between border-b border-slate-700/50">
            <View className="flex-row items-center">
              <Ionicons name="settings-outline" size={20} color="#94a3b8" className="mr-3" />
              <Text className="text-white font-medium text-base">General Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748b" />
          </View>

          <View className="p-4 flex-row items-center justify-between border-b border-slate-700/50">
            <View className="flex-row items-center">
              <Ionicons name="shield-checkmark-outline" size={20} color="#94a3b8" className="mr-3" />
              <Text className="text-white font-medium text-base">Security & Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748b" />
          </View>

          <View className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="color-palette-outline" size={20} color="#94a3b8" className="mr-3" />
              <Text className="text-white font-medium text-base">Appearance & Theme</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748b" />
          </View>
        </View>

        <Button
          title="Sign Out"
          variant="outline"
          onPress={() => alert("Sign out logic can be placed here.")}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}
