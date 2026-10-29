import React from "react";
import { ImageBackground, StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  bgImage?: any;
}

const defaultBg = require("../../../assets/images/main-background.png");

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  className = "",
  style,
  bgImage,
}) => {
  return (
    <ImageBackground
      source={bgImage || defaultBg}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={style}
        className={`flex-1 ${className}`}
      >
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#FEEED6",
  },
});
