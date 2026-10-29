import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  letterService,
  CreateLetterPayload,
  UpdateLetterPayload,
} from "@/services/letter.service";

// 1. GET /letters/?status=all|pending|opened
export const useLetters = (status?: string) => {
  return useQuery({
    queryKey: ["letters", status ?? "all"],
    queryFn: () => letterService.getLetters(status),
  });
};

// 2. POST /letters/ with automatic revalidation
export const useCreateLetter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLetterPayload) =>
      letterService.createLetter(payload),
    onSuccess: () => {
      // Automatically revalidate letters query
      queryClient.invalidateQueries({ queryKey: ["letters"] });
    },
  });
};

// 3. PATCH /letters/<pk>/ with automatic revalidation
export const useOpenLetter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => letterService.openLetter(id),
    onSuccess: () => {
      // Automatically revalidate letters query
      queryClient.invalidateQueries({ queryKey: ["letters"] });
    },
  });
};

// 4. GET /letters/<pk>/
export const useLetterDetail = (id?: number | string) => {
  return useQuery({
    queryKey: ["letter", id ? String(id) : null],
    queryFn: () => letterService.getLetterDetail(id!),
    enabled: Boolean(id),
  });
};

// 5. PATCH /letters/{id}/ with automatic revalidation
export const useUpdateLetter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: UpdateLetterPayload;
    }) => letterService.updateLetter(id, payload),
    onSuccess: (_, variables) => {
      // Revalidate list of letters & single letter detail
      queryClient.invalidateQueries({ queryKey: ["letters"] });
      queryClient.invalidateQueries({
        queryKey: ["letter", String(variables.id)],
      });
    },
  });
};

// 6. DELETE /letters/{id}/ with automatic revalidation
export const useDeleteLetter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => letterService.deleteLetter(id),
    onSuccess: (_, id) => {
      // Revalidate list of letters & remove deleted letter detail from cache
      queryClient.invalidateQueries({ queryKey: ["letters"] });
      queryClient.removeQueries({ queryKey: ["letter", String(id)] });
    },
  });
};
