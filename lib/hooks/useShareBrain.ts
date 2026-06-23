"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toggleShareLink } from "../api";
import type { ShareLink } from "../types";

export const SHARE_LINK_QUERY_KEY = ["shareLink"] as const;

// Fetch the current share-link state by trying to enable it (share:true returns the current link)
// We persist the last known state in the query cache instead of a dedicated GET endpoint.
export function useShareLink() {
  return useQuery<ShareLink | null>({
    queryKey: SHARE_LINK_QUERY_KEY,
    queryFn: () => null,         // populated only via mutation
    initialData: null,
    staleTime: Infinity,
  });
}

export function useToggleShareLink() {
  const qc = useQueryClient();
  return useMutation<ShareLink, Error, boolean>({
    mutationFn: (share: boolean) => toggleShareLink({ share }),
    onSuccess: (data) => {
      qc.setQueryData<ShareLink>(SHARE_LINK_QUERY_KEY, data);
    },
  });
}
