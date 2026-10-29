import { useTodayCheckIn } from "@/hooks/useHome";
import { getAccessToken, getRefreshToken } from "@/utils/token";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Announcement from "./announcement";
import CalendarStickerSection from "./CalendarStickerSection";
import Header from "./Header";
import HeroCard from "./HeroCard";
import QuickActions from "./QuickActions";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPadding = 80 + (insets.bottom > 0 ? insets.bottom : 20);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // 1. Fetch today's check-in status from API
  const { data: todayCheckIn, isLoading: isCheckInLoading } = useTodayCheckIn();
  console.log(todayCheckIn)
  // 2. Unlocked when has_record is true; locked if false / null
  const isUnlocked = todayCheckIn?.has_record === true;

  // 3. Safe destructuring of unlocked daily check-in data
  const checkInData = todayCheckIn?.data;

  // 4. Day status (e.g. { code: 'normal' | 'lucky' | 'bad_luck', name_en, name_zh, ... })
  const dayStatus = checkInData?.day_status || todayCheckIn?.day_status;

  const dateDay = checkInData?.day ? String(checkInData.day) : undefined;
  const dateMonthYear = checkInData?.month_year || undefined;
  const dateWeekday = checkInData
    ? `${checkInData.weekday_zh || ""} ${checkInData.weekday_en || ""}`.trim()
    : undefined;

  const goodForText = checkInData?.good_for?.zh || undefined;
  const goodForEnglish = checkInData?.good_for?.en
    ? `Good for: ${checkInData.good_for.en}`
    : undefined;

  const avoidText = checkInData?.avoid?.zh || undefined;
  const avoidEnglish = checkInData?.avoid?.en
    ? `Avoid: ${checkInData.avoid.en}`
    : undefined;

  const luckyColorName = checkInData?.lucky_color
    ? `${checkInData.lucky_color.name_zh || ""} ${checkInData.lucky_color.name_en || ""}`.trim()
    : undefined;
  const luckyColorHex = checkInData?.lucky_color?.hex || undefined;

  const luckyNumber =
    checkInData?.lucky_number !== undefined
      ? checkInData.lucky_number
      : undefined;

  const luckyDirection = checkInData?.lucky_direction
    ? `${checkInData.lucky_direction.name_zh || ""} ${checkInData.lucky_direction.code || checkInData.lucky_direction.name_en || ""
      }`.trim()
    : undefined;

  const chineseQuote = checkInData?.quote?.zh || undefined;
  const englishQuote = checkInData?.quote?.en || undefined;

  useEffect(() => {
    const checkMyToken = async () => {
      const token = await getAccessToken();
      const refresh = await getRefreshToken();
      console.log("🔑 Current Access Token:", token);
      console.log("🔄 Current Refresh Token:", refresh);
    };
    checkMyToken();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isDragging}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
      >
        <HeroCard isUnlocked={isUnlocked} />
        <Announcement
          isUnlocked={isUnlocked}
          dayStatus={dayStatus}
          dateDay={dateDay}
          dateMonthYear={dateMonthYear}
          dateWeekday={dateWeekday}
          goodForText={goodForText}
          goodForEnglish={goodForEnglish}
          avoidText={avoidText}
          avoidEnglish={avoidEnglish}
          luckyColorName={luckyColorName}
          luckyColorHex={luckyColorHex}
          luckyNumber={luckyNumber}
          luckyDirection={luckyDirection}
          chineseQuote={chineseQuote}
          englishQuote={englishQuote}
        />
        <QuickActions
          onCheckFortune={() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          }}
          onWriteLetter={() => router.push("/add-letter")}
          onCatTarot={() => router.push("/notifications")}
        />
        <CalendarStickerSection onDragStateChange={setIsDragging} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 8,
  },
});