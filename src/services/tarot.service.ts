import { httpGet, httpPost } from "./api";
import { TodayTarotResponse } from "@/types";

export const tarotService = {
  // GET today's tarot reading / cards
  getTodayTarot: async (): Promise<TodayTarotResponse> => {
    const endpoint = "/tarot/today/";
    console.log("➡️ [GET] Tarot Endpoint:", endpoint);
    const result = await httpGet(endpoint);
    console.log("🔮 [Today Tarot Response]:", result);
    return result as TodayTarotResponse;
  },

  // POST today's tarot card draw
  drawTarotCard: async (cardNumber: number): Promise<TodayTarotResponse> => {
    const endpoint = "/tarot/today/";
    const payload = { card_number: cardNumber };
    console.log("➡️ [POST] Tarot Endpoint:", endpoint, "Payload:", payload);
    const result = await httpPost(endpoint, payload);
    console.log("🔮 [Draw Tarot Response]:", result);
    return result as TodayTarotResponse;
  },
};

export default tarotService;
