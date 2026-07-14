"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useContent } from "@/lib/hooks/useContent";
import type { TagEntry } from "./types";

const CUSTOM_TAGS_STORAGE_KEY = "sb_custom_tags";
const CUSTOM_TAGS_EVENT = "sb-custom-tags-updated";
const EMPTY_TAGS: string[] = [];
let cachedStoredTags: string | null = null;
let cachedTags: string[] = EMPTY_TAGS;

function readCustomTags(): string[] {
  if (typeof window === "undefined") return EMPTY_TAGS;

  try {
    const storedTags = localStorage.getItem(CUSTOM_TAGS_STORAGE_KEY) ?? "[]";
    if (storedTags === cachedStoredTags) return cachedTags;

    const savedTags = JSON.parse(storedTags);
    cachedStoredTags = storedTags;
    cachedTags = Array.isArray(savedTags)
      ? savedTags.filter((tag): tag is string => typeof tag === "string")
      : EMPTY_TAGS;
    return cachedTags;
  } catch {
    return EMPTY_TAGS;
  }
}

function subscribeToCustomTags(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CUSTOM_TAGS_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CUSTOM_TAGS_EVENT, onStoreChange);
  };
}

/** Stores a tag that exists independently of any saved note. */
export function createCustomTag(title: string) {
  if (typeof window === "undefined") return;

  const normalizedTitle = title.trim();
  if (!normalizedTitle) return;

  const tags = readCustomTags();
  if (tags.some((tag) => tag.toLowerCase() === normalizedTitle.toLowerCase())) return;

  localStorage.setItem(CUSTOM_TAGS_STORAGE_KEY, JSON.stringify([...tags, normalizedTitle]));
  window.dispatchEvent(new Event(CUSTOM_TAGS_EVENT));
}

/** Derives a sorted list of { title, count } from all notes in the cache */
export function useAllTags(): {
  tags: TagEntry[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} {
  const { data: notes = [], isLoading, isError, refetch } = useContent();
  const customTags = useSyncExternalStore(
    subscribeToCustomTags,
    readCustomTags,
    () => EMPTY_TAGS
  );

  const tags = useMemo<TagEntry[]>(() => {
    const map = new Map<string, number>();
    for (const note of notes) {
      for (const tag of note.tags) {
        map.set(tag.title, (map.get(tag.title) ?? 0) + 1);
      }
    }

    for (const tag of customTags) {
      if (!Array.from(map.keys()).some((title) => title.toLowerCase() === tag.toLowerCase())) {
        map.set(tag, 0);
      }
    }

    return Array.from(map.entries())
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title));
  }, [notes, customTags]);

  return { tags, isLoading, isError, refetch };
}
