"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTrash, restoreFromTrash, permanentlyDelete } from "../api";
import { CONTENT_QUERY_KEY } from "./useContent";

export const TRASH_QUERY_KEY = ["trash"] as const;

export function useTrash() {
  return useQuery({
    queryKey: TRASH_QUERY_KEY,
    queryFn: async () => {
      const data = await getTrash();
      return data.content;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useRestoreFromTrash() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreFromTrash(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TRASH_QUERY_KEY });
      qc.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
    },
  });
}

export function usePermanentlyDelete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => permanentlyDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TRASH_QUERY_KEY });
    },
  });
}
