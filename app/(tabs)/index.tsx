import HomeScreen from "@/components/home/homeScreen";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useRouter } from "expo-router";

export default function HomeTab() {
  const router = useRouter();
  useRefreshOnFocus();
  // const checkMyToken = async () => {
  //   const token = await getAccessToken();
  //   // const refresh = await getRefreshToken();
  //   // const user = await getAuthUser();
  //   console.log("🔑 Current Access Token:", token);
  //   // console.log("🔄 Current Refresh Token:", refresh);
  //   // console.log("👤 Logged In User:", user);
  // };

  return (
    <ScreenWrapper className="px-3">
      <HomeScreen />
    </ScreenWrapper>
  );
}
