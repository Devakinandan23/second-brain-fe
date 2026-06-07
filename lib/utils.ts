import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SourceType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatGroupDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / 86400000
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function getDayLabel(dateString: string): {
  day: string;
  weekday: string;
} {
  const date = new Date(dateString);
  return {
    day: date.getDate().toString(),
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
  };
}

export const SOURCE_TYPE_CONFIG: Record<
  SourceType,
  { label: string; color: string; bgColor: string }
> = {
  YOUTUBE: {
    label: "YouTube",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  TWITTER: {
    label: "Twitter",
    color: "text-sky-500",
    bgColor: "bg-sky-50",
  },
  NOTION: {
    label: "Notion",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  GOOGLE_DOC: {
    label: "Google Doc",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  WEBSITE: {
    label: "Website",
    color: "text-violet-500",
    bgColor: "bg-violet-50",
  },
  INTERNAL: {
    label: "Note",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
};

export function getSourceLabel(sourceType: SourceType): string {
  return SOURCE_TYPE_CONFIG[sourceType]?.label ?? sourceType;
}

export function groupNotesByDate<T extends { createdAt: string }>(
  notes: T[]
): { date: string; items: T[] }[] {
  const groups: Record<string, T[]> = {};

  for (const note of notes) {
    const key = formatGroupDate(note.createdAt);
    if (!groups[key]) groups[key] = [];
    groups[key].push(note);
  }

  return Object.entries(groups).map(([date, items]) => ({ date, items }));
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}
