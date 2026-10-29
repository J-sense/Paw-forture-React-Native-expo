import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { homeService } from "@/services/home.service";

// 1. GET query for today's check-in status
export const useTodayCheckIn = () => {
  return useQuery({
    queryKey: ["todayCheckIn"],
    queryFn: () => homeService.getTodayCheckIn(),
  });
};

// 2. POST mutation to check-in today with automatic revalidation
export const useCheckInToday = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => homeService.checkInToday(),
    onSuccess: (data) => {
      console.log("🔄 Revalidating todayCheckIn query...");
      // Revalidates and refetches the GET query immediately
      queryClient.invalidateQueries({ queryKey: ["todayCheckIn"] });
      queryClient.invalidateQueries({ queryKey: ["calendarData"] });
    },
  });
};

// 3. GET calendar data with optional filter params (year, month, start_year, end_year)
export const useCalendarData = (params?: {
  year?: number | string;
  month?: number | string;
  start_year?: number | string;
  end_year?: number | string;
}) => {
  return useQuery({
    queryKey: [
      "calendarData",
      params?.year,
      params?.month,
      params?.start_year,
      params?.end_year,
    ],
    queryFn: () => homeService.getCalendar(params),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

