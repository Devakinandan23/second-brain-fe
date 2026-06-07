"use client";

import { cn } from "@/lib/utils";

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  backend: { bg: "bg-orange-100", text: "text-orange-700" },
  "system-design": { bg: "bg-purple-100", text: "text-purple-700" },
  "ai-ml": { bg: "bg-green-100", text: "text-green-700" },
  ai: { bg: "bg-green-100", text: "text-green-700" },
  career: { bg: "bg-pink-100", text: "text-pink-700" },
  reading: { bg: "bg-amber-100", text: "text-amber-700" },
  "web-dev": { bg: "bg-blue-100", text: "text-blue-700" },
  projects: { bg: "bg-violet-100", text: "text-violet-700" },
  tools: { bg: "bg-cyan-100", text: "text-cyan-700" },
  dsa: { bg: "bg-red-100", text: "text-red-700" },
  scalability: { bg: "bg-indigo-100", text: "text-indigo-700" },
  habits: { bg: "bg-lime-100", text: "text-lime-700" },
};

function getTagColor(tag: string) {
  const key = tag.toLowerCase().replace(/\s+/g, "-");
  return (
    TAG_COLORS[key] ?? { bg: "bg-gray-100", text: "text-gray-600" }
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
