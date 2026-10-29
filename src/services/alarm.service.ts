import { httpGet, httpPost, httpPatch, httpDelete } from "./api";
import { AlarmItem } from "@/components/alarm/AlarmCard";

export interface CreateAlarmPayload {
  time: string;
  period: "AM" | "PM";
  titleZh: string;
  titleEn: string;
  repeat: string;
  iconEmoji: string;
  bgColor: string;
  borderColor: string;
  enabled: boolean;
  days?: string[];
  note?: string;
}

export interface AlarmResponse<T = AlarmItem> {
  success: boolean;
  status_code: number;
  message?: {
    en: string;
    zh: string;
  };
  message_eng?: string;
  message_chinese?: string;
  count?: number;
  data: T;
}

export const alarmService = {
  // POST /daily-check-in/alarms/
  createAlarm: async (
    payload: CreateAlarmPayload
  ): Promise<AlarmResponse<AlarmItem>> => {
    const endpoint = "/daily-check-in/alarms/";
    console.log("➡️ [POST Alarm] Endpoint:", endpoint);
    console.log("📦 [Payload]:", payload);
    const result = await httpPost<AlarmResponse<AlarmItem>>(endpoint, payload);
    console.log("✅ [Create Alarm Response]:", result);
    return result;
  },

  // GET /daily-check-in/alarms/
  getAlarms: async (): Promise<AlarmResponse<AlarmItem[]>> => {
    const endpoint = "/daily-check-in/alarms/";
    console.log("➡️ [GET Alarms] Endpoint:", endpoint);
    const result = await httpGet<AlarmResponse<AlarmItem[]>>(endpoint);
    console.log("✅ [Get Alarms Response]:", result);
    return result;
  },

  // DELETE /daily-check-in/alarms/{id}/
  deleteAlarm: async (id: string | number): Promise<AlarmResponse<any>> => {
    const endpoint = `/daily-check-in/alarms/${id}/`;
    console.log("➡️ [DELETE Alarm] Endpoint:", endpoint);
    const result = await httpDelete<AlarmResponse<any>>(endpoint);
    console.log("✅ [Delete Alarm Response]:", result);
    return result;
  },
};

export default alarmService;
