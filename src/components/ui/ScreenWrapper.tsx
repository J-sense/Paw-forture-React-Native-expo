import React from "react";
import { ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  className = "",
  style,
}) => {
  return (
    <SafeAreaView
      style={style}
      className={`flex-1 bg-slate-900 ${className}`}
    >
      {children}
    </SafeAreaView>
  );
};
