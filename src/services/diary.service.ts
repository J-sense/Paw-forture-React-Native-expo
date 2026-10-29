import { httpGet, httpPost, httpPatch, httpPut, httpDelete } from "./api";

export interface CreateDiaryPayload {
  icon?: string;
  date: string; // Format: "YYYY-MM-DD"
  note: string;
}

export interface UpdateDiaryPayload {
  icon: string;
  date: string;
  note: string;
}

export interface DiaryItem {
  id: number | string;
  icon: string;
  date: string;
  note: string;
  day?: number;
  month_year?: string;
  weekday_en?: string;
  weekday_zh?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DiaryResponse<T = DiaryItem> {
  success: boolean;
  status_code: number;
  message?: {
    en: string;
    zh: string;
  };
  message_eng?: string;
  message_chinese?: string;
  data: T;
}

export const diaryService = {
  // GET /diary/
  getDiaries: async (params?: Record<string, unknown>) => {
    const endpoint = "/diary/";
    console.log("➡️ [GET] Endpoint:", endpoint, "Params:", params);
    const result = await httpGet(endpoint, { params });
    console.log("✅ [Get Diaries Response]:", result);
    return result;
  },

  // GET /diary/{id}/
  getDiaryDetail: async (id: number | string) => {
    const endpoint = `/diary/${id}/`;
    console.log("➡️ [GET Detail] Endpoint:", endpoint);
    const result = await httpGet(endpoint);
    console.log("✅ [Get Diary Detail Response]:", result);
    return result;
  },

  // POST /diary/
  createDiary: async (payload: CreateDiaryPayload): Promise<DiaryResponse<DiaryItem>> => {
    const endpoint = "/diary/";
    console.log("➡️ [POST] Endpoint:", endpoint);
    console.log("📦 [Payload]:", payload);
    const result = await httpPost<DiaryResponse<DiaryItem>>(endpoint, payload);
    console.log("✅ [Create Diary Response]:", result);
    return result;
  },

  // PATCH /diary/{id}/ (or PUT fallback)
  updateDiary: async (
    id: number | string,
    payload: UpdateDiaryPayload | Partial<CreateDiaryPayload>
  ): Promise<DiaryResponse<DiaryItem>> => {
    const endpoint = `/diary/${id}/`;
    console.log("➡️ [Update Diary] Endpoint:", endpoint, "Payload:", payload);
    try {
      const result = await httpPatch<DiaryResponse<DiaryItem>>(endpoint, payload);
      console.log("✅ [Update Diary Response]:", result);
      return result;
    } catch (err: any) {
      if (err?.response?.status === 405) {
        const result = await httpPut<DiaryResponse<DiaryItem>>(endpoint, payload);
        console.log("✅ [Update Diary Response via PUT]:", result);
        return result;
      }
      throw err;
    }
  },

  // DELETE /diary/{id}/
  deleteDiary: async (id: number | string) => {
    const endpoint = `/diary/${id}/`;
    console.log("➡️ [DELETE] Endpoint:", endpoint);
    const result = await httpDelete(endpoint);
    console.log("✅ [Delete Diary Response]:", result);
    return result;
  },
};

export default diaryService;
