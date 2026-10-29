import React, { useEffect, useRef } from "react";
import { Image, Animated, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation for welcome screen image
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Auto-redirect to home tab after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, router]);

  const handlePress = () => {
    router.replace("/(tabs)");
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Image
          source={require("../assets/images/splash-screen.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#FEEED6",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});