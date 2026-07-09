"use client";

import { useMemo } from "react";
import { useContent } from "@/lib/hooks/useContent";
import type { TagEntry } from "./types";

/** Derives a sorted list of { title, count } from all notes in the cache */
export function useAllTags(): {
  tags: TagEntry[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} {
  const { data: notes = [], isLoading, isError, refetch } = useContent();

  const tags = useMemo<TagEntry[]>(() => {
    const map = new Map<string, number>();
    for (const note of notes) {
      for (const tag of note.tags) {
        map.set(tag.title, (map.get(tag.title) ?? 0) + 1);
      }
    }
    return Array.from(map.entries())
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title));
  }, [notes]);

  return { tags, isLoading, isError, refetch };
}
