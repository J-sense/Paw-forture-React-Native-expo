import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tarotService } from "@/services/tarot.service";

// 1. GET query for today's tarot reading
export const useTodayTarot = () => {
  return useQuery({
    queryKey: ["todayTarot"],
    queryFn: () => tarotService.getTodayTarot(),
  });
};

// 2. POST mutation to draw today's tarot card with automatic revalidation
export const useDrawTarotCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cardNumber: number) => tarotService.drawTarotCard(cardNumber),
    onSuccess: async (data) => {
      console.log("🔄 [useDrawTarotCard] Revalidating todayTarot query...", data);
      await queryClient.invalidateQueries({ queryKey: ["todayTarot"] });
    },
  });
};

