"use client";

import { useMemo, useState } from "react";
import { cn, formatGroupDate } from "@/lib/utils";
import type { Note } from "@/lib/types";
import { ContentCard } from "./ContentCard";

interface ContentCalendarViewProps {
  notes: Note[];
  selectedNoteId?: string | null;
  onSelectNote: (note: Note) => void;
}

// Generate the last 90 days for the heatmap
function generateHeatmap(notes: Note[], daysToShow = 90) {
  const map = new Map<string, number>();
  for (const n of notes) {
    const d = new Date(n.createdAt).toISOString().split("T")[0];
    map.set(d, (map.get(d) || 0) + 1);
  }
  
  const days = [];
  const today = new Date();
  for (let i = daysToShow - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    days.push({
      dateStr,
      count: map.get(dateStr) || 0,
      date: d,
    });
  }
  return days;
}

function getHeatmapColor(count: number) {
  if (count === 0) return "bg-gray-100 dark:bg-gray-800";
  if (count === 1) return "bg-blue-200 dark:bg-blue-900/60";
  if (count <= 3) return "bg-blue-400 dark:bg-blue-700/80";
  return "bg-blue-600 dark:bg-blue-500";
}

export function ContentCalendarView({
  notes,
  selectedNoteId,
  onSelectNote,
}: ContentCalendarViewProps) {
  const heatmapDays = useMemo(() => generateHeatmap(notes), [notes]);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Filter notes by selected date if one is clicked, otherwise show all timeline style
  const displayedNotes = useMemo(() => {
    if (!selectedDateStr) return notes;
    return notes.filter((n) => n.createdAt.startsWith(selectedDateStr));
  }, [notes, selectedDateStr]);

  // Group notes for the timeline view
  const groupedTimeline = useMemo(() => {
    const groups: Record<string, Note[]> = {};
    for (const note of displayedNotes) {
      const key = formatGroupDate(note.createdAt);
      if (!groups[key]) groups[key] = [];
      groups[key].push(note);
    }
    return Object.entries(groups).map(([date, items]) => ({ date, items }));
  }, [displayedNotes]);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50 dark:bg-gray-900/30 overflow-y-auto">
      
      {/* ── Heatmap Section ── */}
      <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
        <h2 className="text-[15px] font-bold text-gray-900 dark:text-white mb-6">Activity (Last 90 Days)</h2>
        
        <div className="flex flex-wrap gap-1.5">
          {heatmapDays.map((day) => {
            const isSelected = selectedDateStr === day.dateStr;
            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => setSelectedDateStr(isSelected ? null : day.dateStr)}
                title={`${day.dateStr}: ${day.count} items`}
                aria-label={`${day.dateStr}: ${day.count} items`}
                aria-pressed={isSelected}
                className={cn(
                  "w-[14px] h-[14px] rounded-[3px] transition-all duration-200",
                  getHeatmapColor(day.count),
                  isSelected && "ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-gray-900 scale-110",
                  "hover:opacity-80"
                )}
              />
            );
          })}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-[11px] font-medium text-gray-500">
          <div className="flex items-center gap-2">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-[10px] h-[10px] rounded-[2px] bg-gray-100 dark:bg-gray-800" />
              <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-200 dark:bg-blue-900/60" />
              <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-400 dark:bg-blue-700/80" />
              <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-600 dark:bg-blue-500" />
            </div>
            <span>More</span>
          </div>
          {selectedDateStr && (
            <button 
              type="button"
              onClick={() => setSelectedDateStr(null)}
              className="text-blue-600 hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* ── Timeline Section ── */}
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {groupedTimeline.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-500">
              No activity on this date.
            </div>
          ) : (
            groupedTimeline.map(({ date, items }) => (
              <div key={date} className="relative pl-6 border-l-2 border-gray-100 dark:border-gray-800">
                {/* Timeline dot */}
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-gray-50 dark:ring-gray-900/30" />
                
                <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 mb-3 ml-2">
                  {date}
                </h3>
                
                <div className="space-y-2 ml-2">
                  {items.map((note) => (
                    <div key={note.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
                      <ContentCard
                        note={note}
                        isSelected={note.id === selectedNoteId}
                        onClick={() => onSelectNote(note)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
}
