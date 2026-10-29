import React from "react";
import { ImageBackground, StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CatTarotScreenWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

const catTarotBg = require("../../../assets/images/cat-tarot/cat-tarot-bg.png");

export const CatTarotScreenWrapper: React.FC<CatTarotScreenWrapperProps> = ({
  children,
  className = "",
  style,
}) => {
  return (
    <ImageBackground
      source={catTarotBg}
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
