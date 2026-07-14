"use client";

import { useState } from "react";

import Image from "next/image";
import { SiYoutube, SiX, SiNotion, SiGoogledocs } from "@icons-pack/react-simple-icons";
import {
  FileText,
  Globe,
  Link2,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { cn, formatTime, getDayLabel } from "@/lib/utils";
import type { Note, SourceType } from "@/lib/types";

// Source icons match the screenshot
function SourceIcon({ type }: { type: SourceType }) {
  const cls = "shrink-0";
  switch (type) {
    case "YOUTUBE":
      return (
        <span className={cn(cls, "text-[#FF0000]")} aria-hidden="true">
          <SiYoutube size={14} />
        </span>
      );
    case "TWITTER":
      return (
        <span className={cn(cls, "text-black dark:text-gray-200")} aria-hidden="true">
          <SiX size={14} />
        </span>
      );
    case "NOTION":
      return (
        <span className={cn(cls, "text-black dark:text-gray-200")} aria-hidden="true">
          <SiNotion size={14} />
        </span>
      );
    case "GOOGLE_DOC":
      return (
        <span className={cn(cls, "text-[#4285F4]")} aria-hidden="true">
          <SiGoogledocs size={14} />
        </span>
      );
    case "WEBSITE":
      return (
        <span className={cn(cls, "text-gray-400 dark:text-gray-500")} aria-hidden="true">
          <Link2 size={14} />
        </span>
      );
    case "INTERNAL":
      return (
        <span className={cn(cls, "text-gray-400 dark:text-gray-500")} aria-hidden="true">
          <FileText size={14} />
        </span>
      );
  }
}

import { getTagColor } from "@/components/common/Tag";

// Tag pill
function TagPill({ label }: { label: string }) {
  const { bg, text } = getTagColor(label);
  const colorClass = `${bg} ${text}`;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium opacity-90",
        colorClass
      )}
    >
      {label}
    </span>
  );
}

interface ContentCardProps {
  note: Note;
  isSelected?: boolean;
  onClick: () => void;
}

export function ContentCard({ note, isSelected, onClick }: ContentCardProps) {
  const [imgError, setImgError] = useState(false);
  const { day, weekday } = getDayLabel(note.createdAt);
  const firstTag = note.tags[0];

  return (
    <div className="flex items-start gap-4 px-4 sm:px-6 py-2.5">
      {/* Date column (outside the card, hidden on mobile) */}
      <div className="hidden sm:flex flex-col items-center w-8 shrink-0 pt-3">
        <span className="text-[10px] font-bold text-gray-800 dark:text-gray-400 uppercase leading-none tracking-wider mb-1">
          {weekday}
        </span>
        <span className="text-[18px] font-bold text-gray-900 dark:text-gray-200 leading-none tabular-nums">
          {day}
        </span>
      </div>

      {/* The Card */}
      <article
        role="button"
        tabIndex={0}
        aria-selected={isSelected}
        onClick={onClick}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
        className={cn(
          "flex-1 flex items-start gap-3 p-4 cursor-pointer transition-all duration-150 rounded-xl border select-none w-full",
          isSelected
            ? "border-blue-300 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-900/20 shadow-sm"
            : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm"
        )}
      >
        {/* Source icon */}
        <div className="shrink-0 pt-0.5 w-[18px] flex justify-center">
          <SourceIcon type={note.sourceType} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-2">
          <h3
            className={cn(
              "text-[14px] font-bold leading-snug mb-2 line-clamp-2",
              isSelected ? "text-gray-900 dark:text-white" : "text-gray-800 dark:text-gray-200"
            )}
          >
            {note.title}
          </h3>
          <div className="flex items-center gap-2.5">
            <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
              {formatTime(note.createdAt)}
            </span>
            {firstTag && <TagPill label={firstTag.title} />}
          </div>
        </div>

        {/* Thumbnail or Placeholder */}
        {(note.thumbnail && !imgError) ? (
          <div className="shrink-0 w-[84px] h-[56px] rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
            <Image
              src={note.thumbnail}
              alt=""
              width={84}
              height={56}
              className="w-full h-full object-cover"
              aria-hidden="true"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className={cn(
            "shrink-0 w-[84px] h-[56px] rounded-lg overflow-hidden border flex items-center justify-center transition-colors",
            note.sourceType === "YOUTUBE" && "bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20 text-red-400 dark:text-red-700",
            note.sourceType === "TWITTER" && "bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600",
            note.sourceType === "GOOGLE_DOC" && "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20 text-blue-300 dark:text-blue-700",
            note.sourceType === "NOTION" && "bg-gray-100/50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-600",
            (note.sourceType === "WEBSITE" || note.sourceType === "INTERNAL") && "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-700"
          )}>
            <Logo className="w-5 h-5 opacity-70" />
          </div>
        )}
      </article>
    </div>
  );
}
