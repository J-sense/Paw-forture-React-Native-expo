import { CalendarBilingualDay } from "@/types";

/**
 * Safely extracts day status information from API response
 * Directly uses calendar_zh / calendar_en and bilingual mapping
 * to show in the calendar.
 */
export const getCalendarDayStatus = (
  calendarData: any,
  year: number | string,
  month: number | string, // 1-12
  day: number | string
): CalendarBilingualDay | null => {
  if (!calendarData) return null;

  const y = String(year);
  const m = String(month);
  const mPad = String(month).padStart(2, "0");
  const d = String(day);
  const dPad = String(day).padStart(2, "0");

  // 1. Direct calendar_zh check (e.g. "平", "吉", "凶")
  const zhRoot =
    calendarData?.calendar_zh ||
    calendarData?.data?.calendar_zh ||
    calendarData?.data?.zh ||
    calendarData?.zh;
  const zhMonth = zhRoot?.[y]?.[m] || zhRoot?.[y]?.[mPad];
  const zhVal = zhMonth?.[d] || zhMonth?.[dPad];

  // 2. Direct calendar_en check (e.g. "Ping", "Ji", "Xiong")
  const enRoot =
    calendarData?.calendar_en ||
    calendarData?.data?.calendar_en ||
    calendarData?.data?.en ||
    calendarData?.en;
  const enMonth = enRoot?.[y]?.[m] || enRoot?.[y]?.[mPad];
  const enVal = enMonth?.[d] || enMonth?.[dPad];

  // 3. Bilingual object check (if available)
  const bilingualRoot =
    calendarData?.data?.bilingual || calendarData?.bilingual;
  const monthBilingual =
    bilingualRoot?.[y]?.[m] || bilingualRoot?.[y]?.[mPad];
  const dayBilingual =
    monthBilingual?.[d] || monthBilingual?.[dPad];

  if (zhVal || enVal || dayBilingual) {
    let normalizedCode: "lucky" | "bad_luck" | "normal" = "normal";

    const testStr = `${zhVal || ""} ${enVal || ""} ${dayBilingual?.code || ""} ${dayBilingual?.zh || ""} ${dayBilingual?.en || ""}`;

    if (
      zhVal === "吉" ||
      enVal === "Ji" ||
      testStr.toLowerCase().includes("lucky") ||
      testStr.toLowerCase().includes("ji") ||
      testStr.includes("吉")
    ) {
      normalizedCode = "lucky";
    } else if (
      zhVal === "凶" ||
      enVal === "Xiong" ||
      testStr.toLowerCase().includes("bad") ||
      testStr.toLowerCase().includes("xiong") ||
      testStr.includes("凶")
    ) {
      normalizedCode = "bad_luck";
    }

    const resolvedZh =
      zhVal ||
      dayBilingual?.zh ||
      (normalizedCode === "lucky" ? "吉" : normalizedCode === "bad_luck" ? "凶" : "平");

    const resolvedEn =
      enVal ||
      dayBilingual?.en ||
      (normalizedCode === "lucky" ? "Ji" : normalizedCode === "bad_luck" ? "Xiong" : "Ping");

    const resolvedStatusZh =
      dayBilingual?.status_zh ||
      (normalizedCode === "lucky" ? "大吉" : normalizedCode === "bad_luck" ? "凶" : "平");

    const resolvedStatusEn =
      dayBilingual?.status_en ||
      (normalizedCode === "lucky" ? "Lucky" : normalizedCode === "bad_luck" ? "Bad Luck" : "Normal");

    return {
      code: normalizedCode,
      zh: resolvedZh,
      en: resolvedEn,
      status_zh: resolvedStatusZh,
      status_en: resolvedStatusEn,
    };
  }

  return null;
};
