import { httpGet, httpPost, httpPatch, httpPut, httpDelete } from "./api";

export interface CreateLetterPayload {
  sticker: string;
  title?: string;
  content: string;
}

export interface UpdateLetterPayload {
  title?: string;
  content: string;
  sticker?: string;
}

export const letterService = {
  // GET /letters/?status=all|pending|opened
  getLetters: async (status?: string) => {
    const endpoint = "/letters/";
    const params = status ? { status } : undefined;
    console.log("➡️ [GET] Endpoint:", endpoint, "Params:", params);
    const result = await httpGet(endpoint, { params });
    console.log("✅ [Get Letters Response]:", result);
    return result;
  },

  // GET /letters/<pk>/
  getLetterDetail: async (id: number | string) => {
    const endpoint = `/letters/${id}/`;
    console.log("➡️ [GET Detail] Endpoint:", endpoint);
    const result = await httpGet(endpoint);
    console.log("✅ [Get Letter Detail Response]:", result);
    return result;
  },

  // POST /letters/
  createLetter: async (payload: CreateLetterPayload) => {
    const endpoint = "/letters/";
    console.log("➡️ [POST] Endpoint:", endpoint);
    console.log("📦 [Payload]:", payload);
    const result = await httpPost(endpoint, payload);
    console.log("✅ [Create Letter Response]:", result);
    return result;
  },

  // PATCH /letters/<pk>/ (or PUT fallback) to mark as opened
  openLetter: async (id: number | string) => {
    const endpoint = `/letters/${id}/`;
    const payload = { status: "opened" };
    console.log("➡️ [Open Letter] Endpoint:", endpoint, "Payload:", payload);
    try {
      const result = await httpPatch(endpoint, payload);
      console.log("✅ [Open Letter Response]:", result);
      return result;
    } catch (err: any) {
      if (err?.response?.status === 405) {
        const result = await httpPut(endpoint, payload);
        console.log("✅ [Open Letter Response via PUT]:", result);
        return result;
      }
      throw err;
    }
  },

  // PATCH /letters/{id}/ (or PUT fallback) to edit/update letter
  updateLetter: async (id: number | string, payload: UpdateLetterPayload) => {
    const endpoint = `/letters/${id}/`;
    console.log("➡️ [Update Letter] Endpoint:", endpoint, "Payload:", payload);
    try {
      const result = await httpPatch(endpoint, payload);
      console.log("✅ [Update Letter Response]:", result);
      return result;
    } catch (err: any) {
      if (err?.response?.status === 405) {
        const result = await httpPut(endpoint, payload);
        console.log("✅ [Update Letter Response via PUT]:", result);
        return result;
      }
      throw err;
    }
  },

  // DELETE /letters/{id}/
  deleteLetter: async (id: number | string) => {
    const endpoint = `/letters/${id}/`;
    console.log("➡️ [DELETE] Endpoint:", endpoint);
    const result = await httpDelete(endpoint);
    console.log("✅ [Delete Letter Response]:", result);
    return result;
  },
};
