import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  diaryService,
  CreateDiaryPayload,
  UpdateDiaryPayload,
} from "@/services/diary.service";

// 1. GET /diary/
export const useDiaries = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["diaries", params],
    queryFn: () => diaryService.getDiaries(params),
  });
};

// 2. GET /diary/{id}/
export const useDiaryDetail = (id?: number | string) => {
  return useQuery({
    queryKey: ["diary", id ? String(id) : null],
    queryFn: () => diaryService.getDiaryDetail(id!),
    enabled: Boolean(id),
  });
};

// 3. POST /diary/ with automatic revalidation
export const useCreateDiary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDiaryPayload) => diaryService.createDiary(payload),
    onSuccess: () => {
      // Revalidate diaries list
      queryClient.invalidateQueries({ queryKey: ["diaries"] });
    },
  });
};

// 4. PATCH /diary/{id}/ with automatic revalidation
export const useUpdateDiary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: UpdateDiaryPayload | Partial<CreateDiaryPayload>;
    }) => diaryService.updateDiary(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["diaries"] });
      queryClient.invalidateQueries({
        queryKey: ["diary", String(variables.id)],
      });
    },
  });
};

// 5. DELETE /diary/{id}/ with automatic revalidation
export const useDeleteDiary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => diaryService.deleteDiary(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["diaries"] });
      queryClient.removeQueries({ queryKey: ["diary", String(id)] });
    },
  });
};
