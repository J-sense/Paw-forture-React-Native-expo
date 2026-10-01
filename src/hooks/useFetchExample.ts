import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/services/api";

// Example GET Query Hook
export const useGetExample = (endpoint: string) => {
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => httpClient.get(endpoint),
  });
};

// Example POST Mutation Hook
export const usePostExample = (endpoint: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => httpClient.post(endpoint, data),
    onSuccess: () => {
      // Invalidate cache or refetch relevant queries automatically
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
  });
};
