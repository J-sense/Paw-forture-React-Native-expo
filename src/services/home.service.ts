import { httpGet, httpPost } from "./api";

export const homeService = {
  // GET today check-in status
  getTodayCheckIn: async () => {
    const endpoint = "/daily-check-in/today/";
    console.log("➡️ [GET] Endpoint:", endpoint);
    const result = await httpGet(endpoint);
    console.log("✅ [Today Check-In Response]:", result);
    return result;
  },

  // POST today check-in
  checkInToday: async () => {
    const endpoint = "/daily-check-in/today/";
    console.log("➡️ [POST] Endpoint:", endpoint);
    const result = await httpPost(endpoint);
    console.log("✅ [Check-In Today Response]:", result);
    return result;
  },

  // GET calendar data
  // Query parameters:
  // - year: Filter to a specific year (e.g. 2026)
  // - month: Filter to a specific month 1-12 (e.g. 10)
  // - start_year: Custom range start year (default: 2026)
  // - end_year: Custom range end year (default: 2030)
  getCalendar: async (params?: {
    year?: number | string;
    month?: number | string;
    start_year?: number | string;
    end_year?: number | string;
  }) => {
    const endpoint = "/daily-check-in/calendar/";
    const queryParams: Record<string, unknown> = {};

    if (params?.year !== undefined && params?.year !== null) {
      queryParams.year = params.year;
    }
    if (params?.month !== undefined && params?.month !== null) {
      queryParams.month = params.month;
    }
    if (params?.start_year !== undefined && params?.start_year !== null) {
      queryParams.start_year = params.start_year;
    }
    if (params?.end_year !== undefined && params?.end_year !== null) {
      queryParams.end_year = params.end_year;
    }

    console.log("➡️ [GET] Calendar Endpoint:", endpoint, "Params:", queryParams);
    const result = await httpGet(endpoint, { params: queryParams });
    console.log("✅ [Calendar Response]:", result);
    return result;
  },
};

