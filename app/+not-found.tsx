import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!", headerShown: true }} />
      <View className="flex-1 items-center justify-center p-5 bg-slate-900">
        <Text className="text-2xl font-bold text-white mb-2">This screen doesn't exist.</Text>
        <Link href="/" className="mt-4 py-3 px-6 bg-indigo-600 rounded-xl">
          <Text className="text-white font-semibold">Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}
