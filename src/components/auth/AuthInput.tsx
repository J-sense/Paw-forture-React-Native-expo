import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AuthInputProps extends TextInputProps {
  label: string;
  labelEn?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  error?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  labelEn,
  iconName,
  isPassword = false,
  error,
  ...textInputProps
}) => {
  const [showPassword, setShowPassword] = useState(!isPassword);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full mb-4">
      {/* Label */}
      <View className="flex-row items-baseline mb-1.5 px-1">
        <Text
          className="text-sm font-bold text-[#43160E]"
          style={{ fontFamily: "ZenMaruGothic-Bold" }}
        >
          {label}
        </Text>
        {labelEn ? (
          <Text
            className="text-[11px] text-[#8C7B75] ml-1.5"
            style={{ fontFamily: "Sora-Medium" }}
          >
            {labelEn}
          </Text>
        ) : null}
      </View>

      {/* Input Box */}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
        ]}
      >
        {/* Left Icon */}
        <View className="w-8 items-center justify-center mr-1">
          <Ionicons
            name={iconName}
            size={18}
            color={error ? "#F43F5E" : isFocused ? "#5D3327" : "#A89F91"}
          />
        </View>

        {/* Input Field */}
        <TextInput
          {...textInputProps}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#A89F91"
          className="flex-1 text-sm text-[#43160E] py-0"
          style={{ fontFamily: "ZenMaruGothic-Medium" }}
        />

        {/* Password Eye Toggle */}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            activeOpacity={0.7}
            className="w-8 items-center justify-center"
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={18}
              color="#A89F91"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error ? (
        <View className="flex-row items-center mt-1 px-1">
          <Ionicons name="alert-circle" size={13} color="#F43F5E" />
          <Text
            className="text-xs text-[#F43F5E] ml-1"
            style={{ fontFamily: "ZenMaruGothic-Medium" }}
          >
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.2,
    borderColor: "#F3E8D5",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#DCB978",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputFocused: {
    borderColor: "#5D3327",
    backgroundColor: "#FFFCF7",
  },
  inputError: {
    borderColor: "#F43F5E",
  },
});
