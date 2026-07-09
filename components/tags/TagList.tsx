"use client";

import { RefreshCcw, Tag, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { TagItem } from "./TagItem";
import type { TagEntry } from "./types";

/* ── Skeleton row ─────────────────────────────────────────────────── */
function SkeletonRow({ index }: { index: number }) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-2.5 animate-pulse"
      style={{ opacity: 1 - index * 0.12 }}
    >
      <span className="w-[18px] h-[18px] rounded-[5px] bg-gray-200 dark:bg-gray-700 shrink-0" />
      <span className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
      <span
        className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 flex-1"
        style={{ maxWidth: `${60 + (index % 4) * 15}%` }}
      />
      <span className="w-6 h-4 rounded-md bg-gray-200 dark:bg-gray-700 shrink-0" />
    </div>
  );
}

/* ── Empty state ──────────────────────────────────────────────────── */
function EmptyState({
  query,
  onCreate,
}: {
  query: string;
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4">
      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
        <Tag size={20} className="text-gray-400 dark:text-gray-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {query ? `No tags matching "${query}"` : "No tags yet"}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {query
            ? "Create a new tag below."
            : "Tags are created when you add them to a note."}
        </p>
      </div>
      {query && (
        <button
          type="button"
          onClick={onCreate}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium",
            "bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-150 shadow-sm"
          )}
        >
          <Plus size={13} /> Create Tag
        </button>
      )}
    </div>
  );
}

/* ── Error state ──────────────────────────────────────────────────── */
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4">
      <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center">
        <Tag size={20} className="text-red-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Failed to load tags
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Something went wrong while fetching your tags.
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className={cn(
          "flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium",
          "border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200",
          "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
        )}
      >
        <RefreshCcw size={13} /> Retry
      </button>
    </div>
  );
}

/* ── TagList ──────────────────────────────────────────────────────── */
interface TagListProps {
  tags: TagEntry[];
  selectedTags: Set<string>;
  onToggle: (title: string) => void;
  query: string;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onCreateFromQuery: () => void;
}

export function TagList({
  tags,
  selectedTags,
  onToggle,
  query,
  isLoading,
  isError,
  onRetry,
  onCreateFromQuery,
}: TagListProps) {
  if (isLoading) {
    return (
      <div className="py-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonRow key={i} index={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (tags.length === 0) {
    return <EmptyState query={query} onCreate={onCreateFromQuery} />;
  }

  return (
    <ul role="listbox" aria-multiselectable="true" className="divide-y divide-gray-100 dark:divide-gray-800">
      {tags.map((tag) => (
        <li key={tag.title} role="option" aria-selected={selectedTags.has(tag.title)}>
          <TagItem
            tag={tag}
            checked={selectedTags.has(tag.title)}
            onToggle={onToggle}
          />
        </li>
      ))}
    </ul>
  );
}
