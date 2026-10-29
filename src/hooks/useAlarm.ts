import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alarmService, CreateAlarmPayload } from "@/services/alarm.service";

// 1. GET /daily-check-in/alarms/
export const useAlarms = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["alarms"],
    queryFn: () => alarmService.getAlarms(),
    ...options,
  });
};

// 2. POST /daily-check-in/alarms/
export const useCreateAlarm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAlarmPayload) => alarmService.createAlarm(payload),
    onSuccess: () => {
      // Invalidate alarms list in cache
      queryClient.invalidateQueries({ queryKey: ["alarms"] });
    },
  });
};

// 3. DELETE /daily-check-in/alarms/{id}/
export const useDeleteAlarm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => alarmService.deleteAlarm(id),
    onSuccess: () => {
      // Invalidate alarms list in cache
      queryClient.invalidateQueries({ queryKey: ["alarms"] });
    },
  });
};
