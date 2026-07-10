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
  getTrash,
  restoreFromTrash,
  permanentlyDelete,
  importContent,
} from "../api";
import type { CreateContentRequest, UpdateContentRequest } from "../types";
import { TRASH_QUERY_KEY } from "./useTrash";

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

export function useImportContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => importContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
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
    mutationFn: ({id}:{id: string}) => deleteContent(id),
    onSuccess: () => {
      // Invalidate both the main content list and the trash list —
      // deleting a note soft-deletes it (moves to trash), so the
      // trash query must re-fetch to show the newly trashed item.
      qc.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
      qc.invalidateQueries({ queryKey: TRASH_QUERY_KEY });
    },
  });
}
