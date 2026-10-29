import { STICKERS } from "@/components/calendar/CalendarView";

export type LetterStatus = "pending" | "opened";
export type LetterTabType = "all" | "pending" | "opened";

// Raw API Letter response format from GET /letters/
export interface ApiLetter {
  id: number | string;
  sticker: string;
  title?: string;
  content: string;
  status: "pending" | "opened" | string;
  status_display?: {
    en: string;
    zh: string;
  };
  is_opened: boolean;
  date: string;
  formatted_date_zh?: string;
  formatted_date_en?: string;
  content_length?: number;
  opened_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface LetterItem {
  id: string;
  titleCn: string;
  titleEn: string;
  descCn: string;
  descEn: string;
  date: string;
  charCount: string;
  status: LetterStatus;
  icon: string;
  bgColor?: string;
  rawContent?: string;
}

// Safely converts database letter into UI LetterItem
export const mapApiLetterToItem = (apiLetter: ApiLetter): LetterItem => {
  const stickerObj = STICKERS.find((s) => s.id === apiLetter.sticker);
  const icon = stickerObj ? stickerObj.emoji : "💌";
  const bgColor = stickerObj?.bgColor || "#FFFBF0";

  const dateStr =
    apiLetter.formatted_date_zh ||
    apiLetter.formatted_date_en ||
    apiLetter.date ||
    "";
  const lengthStr = `${apiLetter.content_length ?? apiLetter.content?.length ?? 0}/1000`;

  const isOpened = apiLetter.is_opened || apiLetter.status === "opened";

  return {
    id: String(apiLetter.id),
    titleCn: apiLetter.title || "未命名信件",
    titleEn: stickerObj?.name || (isOpened ? "Opened Letter" : "Unopened Letter"),
    descCn: apiLetter.content || "",
    descEn: isOpened ? "Already opened letter" : "A letter written to the future...",
    date: dateStr,
    charCount: lengthStr,
    status: isOpened ? "opened" : "pending",
    icon,
    bgColor,
    rawContent: apiLetter.content,
  };
};
