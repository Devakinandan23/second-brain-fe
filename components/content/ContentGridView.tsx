"use client";

import { ContentGridCard } from "./ContentGridCard";
import type { Note } from "@/lib/types";

interface ContentGridViewProps {
  notes: Note[];
  selectedNoteId?: string | null;
  onSelectNote: (note: Note) => void;
}

export function ContentGridView({
  notes,
  selectedNoteId,
  onSelectNote,
}: ContentGridViewProps) {
  return (
    <div
      className="flex-1 overflow-y-auto p-6"
      role="grid"
      aria-label="Content grid"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
        {notes.map((note) => (
          <ContentGridCard
            key={note.id}
            note={note}
            isSelected={note.id === selectedNoteId}
            onClick={() => onSelectNote(note)}
          />
        ))}
      </div>
    </div>
  );
}
