export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface DayStatus {
  code?: string;
  status?: string;
  name_en?: string;
  name_zh?: string;
  en?: string;
  zh?: string;
}

export interface CalendarBilingualDay {
  en?: string;
  zh?: string;
  code?: "normal" | "lucky" | "bad_luck" | string;
  status_en?: string;
  status_zh?: string;
}

export interface CalendarApiResponse {
  success?: boolean;
  status_code?: number;
  message?: { en?: string; zh?: string };
  message_eng?: string;
  message_chinese?: string;
  calendar_en?: Record<string, Record<string, Record<string, string>>>;
  calendar_zh?: Record<string, Record<string, Record<string, string>>>;
  data?: {
    en?: Record<string, Record<string, Record<string, string>>>;
    zh?: Record<string, Record<string, Record<string, string>>>;
    calendar_en?: Record<string, Record<string, Record<string, string>>>;
    calendar_zh?: Record<string, Record<string, Record<string, string>>>;
    bilingual?: Record<string, Record<string, Record<string, CalendarBilingualDay>>>;
  };
}

export interface CalendarQueryParams {
  year?: number | string;
  month?: number | string;
  start_year?: number | string;
  end_year?: number | string;
}

export interface TarotCategory {
  en?: string;
  zh?: string;
}

export interface TarotData {
  id?: number;
  card_number?: number;
  date?: string;
  day?: number;
  month_year?: string;
  weekday_en?: string;
  weekday_zh?: string;
  category?: TarotCategory;
  tag?: TarotCategory;
  title?: TarotCategory;
  content?: TarotCategory;
  created_at?: string;
  updated_at?: string;
}

export interface TodayTarotResponse {
  success?: boolean;
  status_code?: number;
  has_record?: boolean;
  data?: TarotData | null;
  message?: { en?: string; zh?: string };
  message_eng?: string;
  message_chinese?: string;
}


