import React from "react";
import { Text, View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { Button } from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";

export default function InfoScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper className="px-5">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
        {/* Back Navigation Bar */}
        <View className="flex-row items-center mb-6">
          <Button
            title="← Back"
            variant="outline"
            onPress={() => router.back()}
            className="py-2 px-4"
          />
        </View>

        {/* Info Screen Header */}
        <View className="items-center my-4">
          <View className="w-16 h-16 rounded-2xl bg-indigo-500/20 items-center justify-center mb-3 border border-indigo-500/30">
            <Ionicons name="information-circle" size={36} color="#818cf8" />
          </View>
          <Text className="text-3xl font-extrabold text-white text-center">
            Information Screen
          </Text>
          <Text className="text-slate-400 text-center text-sm mt-2">
            This is a standalone Stack screen outside of the bottom Tab bar.
          </Text>
        </View>

        {/* Information Details Card */}
        <View className="bg-slate-800 p-5 rounded-2xl border border-slate-700/50 my-4 gap-3">
          <Text className="text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            How Expo Router Navigation Works
          </Text>

          <View className="flex-row items-start mt-2">
            <Text className="text-indigo-400 mr-2 font-bold">•</Text>
            <Text className="text-slate-200 text-sm flex-1 leading-5">
              Files outside <Text className="font-mono text-indigo-300">app/(tabs)</Text> (like <Text className="font-mono text-indigo-300">app/info.tsx</Text>) open as full Stack screens.
            </Text>
          </View>

          <View className="flex-row items-start">
            <Text className="text-indigo-400 mr-2 font-bold">•</Text>
            <Text className="text-slate-200 text-sm flex-1 leading-5">
              Use <Text className="font-mono text-indigo-300">router.push('/info')</Text> to navigate from any button or event handler.
            </Text>
          </View>

          <View className="flex-row items-start">
            <Text className="text-indigo-400 mr-2 font-bold">•</Text>
            <Text className="text-slate-200 text-sm flex-1 leading-5">
              Use <Text className="font-mono text-indigo-300">router.back()</Text> to return to the previous tab screen.
            </Text>
          </View>
        </View>

        <Button
          title="Return to Home"
          variant="primary"
          onPress={() => router.back()}
          className="mt-4"
        />
      </ScrollView>
    </ScreenWrapper>
  );
}
