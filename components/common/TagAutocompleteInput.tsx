"use client";

import { useState } from "react";
import { useContent } from "@/lib/hooks/useContent";
import type { Note } from "@/lib/types";

export function TagAutocompleteInput({ 
  editTags, 
  setEditTags 
}: { 
  editTags: string[], 
  setEditTags: (tags: string[]) => void 
}) {
  const [tagInput, setTagInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { data: notesData } = useContent();
  const allNotes: Note[] = notesData || [];
  
  // Extract unique tags
  const uniqueTags = Array.from(new Set(allNotes.flatMap((n: Note) => n.tags.map(t => t.title))));
  
  // Filter by input
  const suggestions = uniqueTags.filter(t => 
    t.toLowerCase().includes(tagInput.toLowerCase()) && !editTags.includes(t)
  );

  function handleAddTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!editTags.includes(tagInput.trim())) {
        setEditTags([...editTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  }

  function handleSelectSuggestion(tag: string) {
    if (!editTags.includes(tag)) {
      setEditTags([...editTags, tag]);
    }
    setTagInput("");
    setIsFocused(false);
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleAddTag}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setTimeout(() => setIsFocused(false), 200);
        }}
        placeholder="Add tag..."
        className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1 text-[13px] outline-none focus:border-blue-500 w-28"
      />
      {isFocused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden max-h-48 overflow-y-auto">
          {suggestions.map(tag => (
            <button
              key={tag}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleSelectSuggestion(tag); }}
              className="w-full text-left px-3 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
