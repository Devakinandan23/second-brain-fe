"use client";

import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagSearchProps {
  value: string;
  onChange: (v: string) => void;
  showCreate: boolean;
  onCreate: () => void;
}

export function TagSearch({ value, onChange, showCreate, onCreate }: TagSearchProps) {
  return (
    <div className="px-4 pb-3 pt-1 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
      <div className="relative flex items-center">
        <Search
          size={14}
          className="absolute left-3 text-gray-400 pointer-events-none shrink-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search or create tag..."
          className={cn(
            "w-full pl-9 pr-4 py-2 rounded-xl text-[13px] bg-gray-50 dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            "text-gray-900 dark:text-gray-100 placeholder-gray-400",
            "outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400",
            "transition-all duration-150"
          )}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {showCreate && value.trim().length > 0 && (
        <button
          type="button"
          onClick={onCreate}
          className={cn(
            "mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[13px]",
            "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10",
            "border border-blue-100 dark:border-blue-500/20",
            "hover:bg-blue-100 dark:hover:bg-blue-500/20",
            "transition-colors duration-150 font-medium"
          )}
        >
          <Plus size={13} className="shrink-0" />
          Create&nbsp;
          <span className="font-semibold">"{value.trim()}"</span>
        </button>
      )}
    </div>
  );
}
