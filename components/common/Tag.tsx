"use client";

import { cn } from "@/lib/utils";

const TAG_COLORS: Record<string, { bg: string; text: string; dot?: string }> = {
  backend: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-400" },
  "system-design": { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-400" },
  "ai-ml": { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-400" },
  ai: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-400" },
  career: { bg: "bg-pink-100", text: "text-pink-700", dot: "bg-pink-400" },
  reading: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-400" },
  "web-dev": { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-400" },
  projects: { bg: "bg-violet-100", text: "text-violet-700", dot: "bg-violet-400" },
  tools: { bg: "bg-cyan-100", text: "text-cyan-700", dot: "bg-cyan-400" },
  dsa: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-400" },
  scalability: { bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-400" },
  habits: { bg: "bg-lime-100", text: "text-lime-700", dot: "bg-lime-400" },
};

export function getTagColor(tag: string) {
  const key = tag.toLowerCase().replace(/\s+/g, "-");
  return (
    TAG_COLORS[key] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" }
  );
}

interface TagProps {
  label: string;
  colored?: boolean;
  className?: string;
  onRemove?: () => void;
}

export function Tag({ label, colored = true, className, onRemove }: TagProps) {
  const { bg, text } = colored
    ? getTagColor(label)
    : { bg: "bg-gray-100", text: "text-gray-600" };

  return (
    <span
      className={cn(
        "tag-pill",
        colored ? `${bg} ${text}` : "bg-gray-100 text-gray-600",
        className
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 transition-opacity"
          aria-label={`Remove tag ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
