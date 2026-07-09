"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import type { TagEntry } from "./types";

interface TagItemProps {
  tag: TagEntry;
  checked: boolean;
  onToggle: (title: string) => void;
}

export const TagItem = memo(function TagItem({ tag, checked, onToggle }: TagItemProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onToggle(tag.title)}
      className={cn(
        "group w-full flex items-center gap-4 px-4 py-3 text-left",
        "transition-colors duration-150",
        "hover:bg-gray-50 dark:hover:bg-gray-800/60"
      )}
    >
      {/* Custom checkbox */}
      <span
        className={cn(
          "flex shrink-0 items-center justify-center w-5 h-5 rounded-[4px] border-[1.5px] transition-all duration-150",
          checked
            ? "bg-[#3B82F6] border-[#3B82F6]"
            : "border-gray-400 dark:border-gray-500 group-hover:border-gray-500 bg-transparent"
        )}
        aria-hidden="true"
      >
        {checked && (
          <svg
            viewBox="0 0 10 8"
            fill="none"
            className="w-3 h-2.5 text-white"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 4l2.5 2.5L9 1" />
          </svg>
        )}
      </span>

      {/* Tag name */}
      <span
        className={cn(
          "flex-1 text-[15px] font-semibold truncate transition-colors duration-150",
          "text-gray-900 dark:text-gray-100"
        )}
      >
        {tag.title}
      </span>

      {/* Usage count */}
      <span className="shrink-0 text-[14px] text-gray-500 dark:text-gray-400 font-medium tabular-nums transition-colors duration-150">
        {tag.count}
      </span>
    </button>
  );
});
