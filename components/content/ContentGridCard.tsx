"use client";

import { cn, formatDate, getSourceLabel } from "@/lib/utils";
import type { Note } from "@/lib/types";
import { SiYoutube, SiX, SiNotion, SiGoogledocs } from "@icons-pack/react-simple-icons";
import { Globe, FileText, Image as ImageIcon } from "lucide-react";
import { getTagColor } from "@/components/common/Tag";

interface ContentGridCardProps {
  note: Note;
  isSelected?: boolean;
  onClick: () => void;
}

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  YOUTUBE: <SiYoutube size={14} className="text-[#FF0000]" />,
  TWITTER: <SiX size={14} className="text-black dark:text-white" />,
  NOTION: <SiNotion size={14} className="text-black dark:text-white" />,
  GOOGLE_DOC: <SiGoogledocs size={14} className="text-[#4285F4]" />,
  WEBSITE: <Globe size={14} className="text-violet-500" />,
  INTERNAL: <FileText size={14} className="text-amber-500" />,
};

// Returns a fallback gradient string based on the source type
function getFallbackGradient(sourceType: string) {
  switch (sourceType) {
    case "YOUTUBE":
      return "from-red-100 to-red-50 dark:from-red-900/40 dark:to-red-900/10";
    case "TWITTER":
      return "from-sky-100 to-sky-50 dark:from-sky-900/40 dark:to-sky-900/10";
    case "NOTION":
      return "from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900";
    case "GOOGLE_DOC":
      return "from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/10";
    case "WEBSITE":
      return "from-violet-100 to-violet-50 dark:from-violet-900/40 dark:to-violet-900/10";
    case "INTERNAL":
      return "from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/10";
    default:
      return "from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900";
  }
}

export function ContentGridCard({ note, isSelected, onClick }: ContentGridCardProps) {
  // Take up to 2 tags to prevent wrapping issues on small grids
  const displayTags = note.tags.slice(0, 2);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col text-left overflow-hidden transition-all duration-200",
        "bg-white dark:bg-gray-900 rounded-2xl",
        "hover:shadow-md hover:-translate-y-0.5",
        "border border-transparent",
        isSelected
          ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-950 shadow-sm"
          : "hover:border-gray-200 dark:hover:border-gray-800"
      )}
    >
      {/* Thumbnail Area (16:9 aspect ratio) */}
      <div className={cn(
        "relative w-full aspect-video rounded-xl overflow-hidden mb-3",
        "bg-gradient-to-br",
        getFallbackGradient(note.sourceType)
      )}>
        {note.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={note.thumbnail}
            alt={note.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            {SOURCE_ICONS[note.sourceType] || <ImageIcon size={32} className="text-gray-400" />}
          </div>
        )}
      </div>

      {/* Metadata Area */}
      <div className="flex items-start gap-3 px-1 pb-2">
        {/* Source Icon Avatar */}
        <div className="shrink-0 w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center mt-0.5">
          {SOURCE_ICONS[note.sourceType]}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title - Max 2 lines */}
          <h3 className="text-[14px] font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 mb-1">
            {note.title}
          </h3>

          {/* Subtitle / Meta */}
          <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-gray-500 dark:text-gray-400">
            <span className="truncate">{getSourceLabel(note.sourceType)}</span>
            <span aria-hidden="true">&bull;</span>
            <span className="truncate whitespace-nowrap">{formatDate(note.createdAt)}</span>
          </div>

          {/* Tags (optional) */}
          {displayTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {displayTags.map(tag => {
                const { bg, text } = getTagColor(tag.title);
                return (
                  <span
                    key={tag.id}
                    className={cn(
                      "px-1.5 py-0.5 rounded-md text-[10px] font-medium transition-colors",
                      bg, text
                    )}
                  >
                    {tag.title}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
