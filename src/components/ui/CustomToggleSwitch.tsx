import React from "react";
import { Pressable, View } from "react-native";

interface CustomToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const CustomToggleSwitch: React.FC<CustomToggleSwitchProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      className={`w-12 h-7 p-[3px] rounded-full justify-center ${
        value ? "bg-[#DE902B] items-end" : "bg-[#CBD5E1] items-start"
      }`}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <View
        className="size-6 bg-white rounded-full"
        style={{
          shadowColor: "rgba(0,0,0,0.18)",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.18,
          shadowRadius: 4,
          elevation: 3,
        }}
      />
    </Pressable>
  );
};

export default CustomToggleSwitch;
