import React from "react";
import { Text, View, TextInput, ScrollView } from "react-native";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";

export default function ExploreTab() {
  useRefreshOnFocus();

  const categories = [
    { title: "Trending Components", icon: "flame-outline", color: "bg-orange-500/20 text-orange-400" },
    { title: "API Services", icon: "cloud-upload-outline", color: "bg-cyan-500/20 text-cyan-400" },
    { title: "State Management", icon: "layers-outline", color: "bg-purple-500/20 text-purple-400" },
    { title: "Native Features", icon: "phone-portrait-outline", color: "bg-emerald-500/20 text-emerald-400" },
  ];

  return (
    <ScreenWrapper className="px-5">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
        <Text className="text-2xl font-bold text-white mb-2">Explore 🔍</Text>
        <Text className="text-slate-400 text-sm mb-5">Discover modules, components, and tools.</Text>

        {/* Search Input Bar */}
        <View className="flex-row items-center bg-slate-800 px-4 py-3 rounded-2xl border border-slate-700/50 mb-6">
          <Ionicons name="search" size={20} color="#94a3b8" className="mr-3" />
          <TextInput
            placeholder="Search starter modules..."
            placeholderTextColor="#64748b"
            className="flex-1 text-white text-sm"
          />
        </View>

        {/* Categories List */}
        <Text className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-3">
          Categories
        </Text>
        <View className="gap-3">
          {categories.map((cat, index) => (
            <View
              key={index}
              className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-slate-700/50 items-center justify-center mr-3">
                  <Ionicons name={cat.icon as any} size={20} color="#6366f1" />
                </View>
                <Text className="text-white font-semibold text-base">{cat.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#64748b" />
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
