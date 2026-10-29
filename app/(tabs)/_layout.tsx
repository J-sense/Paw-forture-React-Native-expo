import { CustomTabBar } from "@/components/navigation/CustomTabBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: "none",
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Calendar",
        }}
      />
      <Tabs.Screen
        name="alarm"
        options={{
          title: "Paw Alarm",
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Cat Tarot",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "My Letter",
        }}
      />
    </Tabs>
  );
}

