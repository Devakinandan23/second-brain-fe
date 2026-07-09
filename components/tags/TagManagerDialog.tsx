"use client";

import { useState, useMemo, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Tag as TagIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAllTags } from "./useAllTags";
import { TagSearch } from "./TagSearch";
import { TagList } from "./TagList";
import type { TagManagerDialogProps, TagManagerTab } from "./types";

/* ────────────────────────────────────────────────────────────────── */
/*  TagManagerDialog                                                  */
/* ────────────────────────────────────────────────────────────────── */
export function TagManagerDialog({
  open,
  onClose,
  noteTags = [],
  onSaveNoteTags,
  onApplyFilter,
  initialFilterTags = [],
}: TagManagerDialogProps) {
  const [query, setQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Server-derived tags
  const { tags: allTags, isLoading, isError, refetch } = useAllTags();

  // Local selection state
  const [selectedTags, setSelectedTags] = useState<Set<string>>(() => {
    if (onApplyFilter) {
      return new Set(initialFilterTags);
    }
    return new Set(noteTags);
  });

  /* Apply search filter */
  const filteredTags = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allTags;
    return allTags.filter((t) => t.title.toLowerCase().includes(q));
  }, [allTags, query]);

  /* Show the "Create" affordance only when query doesn't match any existing tag */
  const showCreate = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q.length > 0 && !allTags.some((t) => t.title.toLowerCase() === q);
  }, [query, allTags]);

  /* Toggle a tag in local selection */
  const handleToggle = useCallback((title: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }, []);

  /* Create a new tag from search query and select it */
  const handleCreate = useCallback(() => {
    const title = query.trim();
    if (!title) return;
    setSelectedTags((prev) => new Set([...prev, title]));
    setQuery("");
  }, [query]);

  /* Reset state when dialog closes */
  function handleOpenChange(v: boolean) {
    if (!v) {
      setQuery("");
      onClose();
    }
  }

  /* Save note tags or apply filter */
  async function handleSave() {
    if (onApplyFilter) {
      onApplyFilter(Array.from(selectedTags));
      onClose();
      return;
    }

    if (!onSaveNoteTags) return;
    
    setIsSaving(true);
    try {
      await onSaveNoteTags(Array.from(selectedTags));
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  const selectedCount = selectedTags.size;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 dark:bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />

        {/* Dialog panel */}
        <Dialog.Content
          aria-describedby="tag-manager-desc"
          className={cn(
            "fixed left-1/2 top-1/2 z-50",
            "-translate-x-1/2 -translate-y-1/2",
            "w-[420px] max-w-[95vw] h-[650px] max-h-[90vh]",
            "bg-white dark:bg-gray-900",
            "rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800",
            "flex flex-col overflow-hidden",
            "animate-in fade-in zoom-in-95 duration-200",
            "outline-none"
          )}
        >
          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <Dialog.Title className="text-[17px] font-bold text-gray-900 dark:text-white">
                {onApplyFilter ? "Filter by tags" : "Manage tags"}
              </Dialog.Title>
              {selectedCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[11px] font-semibold">
                  {selectedCount} selected
                </span>
              )}
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close tag manager"
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-150"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          {/* ── Search (sticky) ────────────────────────────────────── */}
          <div className="shrink-0 bg-white dark:bg-gray-900 pt-3">
            <TagSearch
              value={query}
              onChange={setQuery}
              showCreate={showCreate}
              onCreate={handleCreate}
            />
          </div>

          {/* ── Scrollable tag list ────────────────────────────────── */}
          <div
            id="tag-manager-desc"
            className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700"
          >
            <TagList
              tags={filteredTags}
              selectedTags={selectedTags}
              onToggle={handleToggle}
              query={query}
              isLoading={isLoading}
              isError={isError}
              onRetry={refetch}
              onCreateFromQuery={handleCreate}
            />
          </div>

          {/* ── Footer ─────────────────────────────────────────────── */}
          {(onSaveNoteTags || onApplyFilter) && (
            <div className="shrink-0 flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <p className="text-[12px] text-gray-400 dark:text-gray-500">
                {allTags.length} tag{allTags.length !== 1 ? "s" : ""} total
              </p>
              <div className="flex items-center gap-2">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl text-[13px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium",
                    "bg-blue-600 hover:bg-blue-700 text-white",
                    "transition-colors duration-150 shadow-sm",
                    "disabled:opacity-60 disabled:cursor-not-allowed"
                  )}
                >
                  {isSaving ? (
                    <><Loader2 size={13} className="animate-spin" /> Saving...</>
                  ) : onApplyFilter ? (
                    "Apply Filter"
                  ) : (
                    "Apply Tags"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Footer when no note context (read-only / browse mode) */}
          {(!onSaveNoteTags && !onApplyFilter) && (
            <div className="shrink-0 flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <p className="text-[12px] text-gray-400 dark:text-gray-500">
                {allTags.length} tag{allTags.length !== 1 ? "s" : ""} total
              </p>
              <p className="text-[12px] text-gray-400 dark:text-gray-500">
                {filteredTags.length} shown
              </p>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
