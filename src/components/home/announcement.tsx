import React, { useState } from "react";
import { ImageSourcePropType, View } from "react-native";
import { DayStatus } from "@/types";
import { AnnouncementHeader } from "./announcement/AnnouncementHeader";
import { LockedContent } from "./announcement/LockedContent";
import { QuoteBanner } from "./announcement/QuoteBanner";
import { UnlockedContent } from "./announcement/UnlockedContent";

export interface AnnouncementProps {
  isLocked?: boolean;
  isUnlocked?: boolean;
  clickCount?: number;
  onToggleLock?: () => void;
  catLockImage?: ImageSourcePropType;
  plantLeftImage?: ImageSourcePropType;
  plantRightImage?: ImageSourcePropType;
  // Day status for header look & badge
  dayStatus?: DayStatus | null;
  dayStatusCode?: string;
  // Customizable unlocked data
  dateDay?: string;
  dateMonthYear?: string;
  dateWeekday?: string;
  goodForText?: string;
  avoidText?: string;
  goodForEnglish?: string;
  avoidEnglish?: string;
  statusBadgeText?: string;
  luckyColorName?: string;
  luckyColorHex?: string;
  luckyNumber?: string | number;
  luckyDirection?: string;
  chineseQuote?: string;
  englishQuote?: string;
}

export const Announcement: React.FC<AnnouncementProps> = ({
  isLocked: propIsLocked,
  isUnlocked,
  clickCount = 0,
  onToggleLock,
  catLockImage,
  plantLeftImage,
  plantRightImage,
  statusBadgeText,
  dayStatus,
  dayStatusCode,
  chineseQuote,
  englishQuote,
  ...unlockedProps
}) => {
  const isUnlockedState = isUnlocked === true || clickCount >= 3;
  const initialLocked = propIsLocked !== undefined ? propIsLocked : !isUnlockedState;

  const [internalLocked, setInternalLocked] = useState(initialLocked);

  React.useEffect(() => {
    if (isUnlocked !== undefined || clickCount !== undefined) {
      setInternalLocked(!isUnlockedState);
    } else if (propIsLocked !== undefined) {
      setInternalLocked(propIsLocked);
    }
  }, [isUnlocked, clickCount, propIsLocked, isUnlockedState]);

  const handleToggle = () => {
    setInternalLocked((prev) => !prev);
    if (onToggleLock) {
      onToggleLock();
    }
  };

  return (
    <View
      className="w-full rounded-[24px] bg-[#FFFDF7] border border-amber-100/70 overflow-hidden my-3"
      style={{
        shadowColor: "#C6AF99",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      {/* 1. Header Bar */}
      <AnnouncementHeader
        isLocked={internalLocked}
        statusBadgeText={statusBadgeText}
        dayStatus={dayStatus}
        dayStatusCode={dayStatusCode}
        onToggleLock={handleToggle}
      />

      {/* 2. Main Content Body */}
      <View className="p-4 items-center">
        {internalLocked ? (
          <LockedContent catLockImage={catLockImage} />
        ) : (
          <UnlockedContent {...unlockedProps} />
        )}

        {/* 3. Middle Quote Banner */}
        <QuoteBanner
          plantLeftImage={plantLeftImage}
          plantRightImage={plantRightImage}
          chineseQuote={chineseQuote}
          englishQuote={englishQuote}
        />
      </View>
    </View>
  );
};

export default Announcement;
