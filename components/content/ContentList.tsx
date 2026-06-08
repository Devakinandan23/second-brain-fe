"use client";

import { ContentCard } from "./ContentCard";
import type { Note, SidebarSection, SourceType } from "@/lib/types";
import { groupNotesByDate } from "@/lib/utils";
import { FileText } from "lucide-react";

function filterNotes(notes: Note[], section: SidebarSection, search: string, tag: string | null): Note[] {
  let filtered = notes;

  const sectionToSource: Partial<Record<SidebarSection, SourceType>> = {
    notes: "INTERNAL",
    articles: "WEBSITE",
    videos: "YOUTUBE",
    tweets: "TWITTER",
  };

  if (section === "documents") {
    filtered = filtered.filter(
      (n) => n.sourceType === "GOOGLE_DOC" || n.sourceType === "NOTION"
    );
  } else if (section === "today") {
    const now = new Date();
    filtered = filtered.filter((n) => {
      const d = new Date(n.createdAt);
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });
  } else if (section === "inbox") {
    const cutoff = Date.now() - 86400000 * 2;
    filtered = filtered.filter(
      (n) => new Date(n.createdAt).getTime() > cutoff
    );
  } else if (section === "favorites") {
    filtered = filtered.filter((n) => n.isFavorite);
  } else if (sectionToSource[section]) {
    filtered = filtered.filter((n) => n.sourceType === sectionToSource[section]);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.description?.toLowerCase().includes(q) ||
        n.tags.some((t) => t.title.toLowerCase().includes(q))
    );
  }

  if (tag) {
    filtered = filtered.filter((n) => n.tags.some((t) => t.title === tag));
  }

  return [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

interface ContentListProps {
  notes: Note[];
  isLoading: boolean;
  selectedNoteId?: string | null;
  onSelectNote: (note: Note) => void;
  activeSection: SidebarSection;
  activeTag?: string | null;
  searchQuery: string;
}

// Skeleton card matching the card layout
function SkeletonCard() {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5 border-l-2 border-l-transparent animate-pulse">
      <div className="flex flex-col items-center w-[38px] shrink-0 gap-1 pt-0.5">
        <div className="h-2.5 w-6 bg-gray-200 rounded" />
        <div className="h-7 w-8 bg-gray-200 rounded" />
      </div>
      <div className="mt-1.5 w-4 h-4 bg-gray-200 rounded shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-200 rounded w-4/5" />
        <div className="h-3 bg-gray-200 rounded w-2/5" />
        <div className="h-4 w-16 bg-gray-100 rounded-full" />
      </div>
      <div className="w-[68px] h-[48px] bg-gray-200 rounded-lg shrink-0" />
    </div>
  );
}

export function ContentList({
  notes,
  isLoading,
  selectedNoteId,
  onSelectNote,
  activeSection,
  activeTag = null,
  searchQuery,
}: ContentListProps) {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const filtered = filterNotes(notes, activeSection, searchQuery, activeTag);
  const groups = groupNotesByDate(filtered);

  if (filtered.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
          <FileText size={18} className="text-gray-400" />
        </div>
        <p className="text-[13px] font-medium text-gray-600 mb-1">
          {searchQuery ? "No results found" : "Nothing here yet"}
        </p>
        <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
          {searchQuery
            ? "Try a different search term"
            : "Add your first piece of content using the panel on the right"}
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto"
      role="list"
      aria-label="Content list"
    >
      {groups.map(({ date, items }) => (
        <div key={date} role="group" aria-label={date}>
          {/* Month/year group header — matches "May 2026" in screenshot */}
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-[13px] font-bold text-gray-800">{date}</h2>
          </div>

          {/* Cards — no extra padding, border-l is on the card itself */}
          {items.map((note) => (
            <ContentCard
              key={note.id}
              note={note}
              isSelected={note.id === selectedNoteId}
              onClick={() => onSelectNote(note)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
