import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { QueryProvider } from "@/providers/QueryProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

// Prevent splash screen from auto-hiding until fonts are loaded
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "ZenMaruGothic-Regular": require("../assets/fonts/Sora,Zen_Maru_Gothic/Zen_Maru_Gothic/ZenMaruGothic-Regular.ttf"),
    "ZenMaruGothic-Medium": require("../assets/fonts/Sora,Zen_Maru_Gothic/Zen_Maru_Gothic/ZenMaruGothic-Medium.ttf"),
    "ZenMaruGothic-Bold": require("../assets/fonts/Sora,Zen_Maru_Gothic/Zen_Maru_Gothic/ZenMaruGothic-Bold.ttf"),
    "ZenMaruGothic-Light": require("../assets/fonts/Sora,Zen_Maru_Gothic/Zen_Maru_Gothic/ZenMaruGothic-Light.ttf"),
    "ZenMaruGothic-Black": require("../assets/fonts/Sora,Zen_Maru_Gothic/Zen_Maru_Gothic/ZenMaruGothic-Black.ttf"),
    "Sora-Regular": require("../assets/fonts/Sora,Zen_Maru_Gothic/Sora/static/Sora-Regular.ttf"),
    "Sora-Medium": require("../assets/fonts/Sora,Zen_Maru_Gothic/Sora/static/Sora-Medium.ttf"),
    "Sora-Bold": require("../assets/fonts/Sora,Zen_Maru_Gothic/Sora/static/Sora-Bold.ttf"),
    "Sora-SemiBold": require("../assets/fonts/Sora,Zen_Maru_Gothic/Sora/static/Sora-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryProvider>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade",
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="add-letter" options={{ headerShown: false }} />
            <Stack.Screen name="letter-detail" options={{ headerShown: false }} />
          </Stack>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
