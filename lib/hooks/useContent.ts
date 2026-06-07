"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getContent,
  createContent,
  updateContent,
  deleteContent,
} from "../api";
import type { CreateContentRequest, UpdateContentRequest } from "../types";

export const CONTENT_QUERY_KEY = ["content"] as const;

export function useContent() {
  return useQuery({
    queryKey: CONTENT_QUERY_KEY,
    queryFn: async () => {
      const data = await getContent();
      return data.content;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useCreateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateContentRequest) => createContent(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
    },
  });
}

export function useUpdateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContentRequest }) =>
      updateContent(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
    },
  });
}

export function useDeleteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contentId: string) => deleteContent({ contentId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
    },
  });
}
