import React from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  className = "",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "bg-cyan-500 active:bg-cyan-600";
      case "outline":
        return "border border-indigo-500 bg-transparent active:bg-indigo-500/10";
      case "primary":
      default:
        return "bg-indigo-600 active:bg-indigo-700";
    }
  };

  const getTextColor = () => {
    if (variant === "outline") return "text-indigo-400";
    return "text-white";
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className={`py-3.5 px-6 rounded-2xl items-center justify-center flex-row shadow-sm ${getVariantStyles()} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" className="mr-2" />
      ) : (
        <Text className={`font-semibold text-base ${getTextColor()}`}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};
