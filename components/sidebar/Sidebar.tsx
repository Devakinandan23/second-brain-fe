"use client";

import { cn } from "@/lib/utils";
import type { SidebarSection, Note, SourceType } from "@/lib/types";
import { SiYoutube, SiX } from "@icons-pack/react-simple-icons";
import {
  Inbox,
  Sun,
  LayoutList,
  Heart,
  Trash2,
  FileText,
  Newspaper,
  Video,
  MessageCircle,
  FolderOpen,
  Settings,
  HelpCircle,
  Plus,
  Star,
  ChevronRight,
  CloudUpload,
} from "lucide-react";

// Tag dot colors matching the screenshot
const TAG_COLORS: { dot: string; name: string }[] = [
  { dot: "bg-orange-400", name: "" }, // System Design
  { dot: "bg-orange-400", name: "" }, // Backend
  { dot: "bg-amber-400", name: "" },  // AI / ML
  { dot: "bg-pink-400", name: "" },   // Career
  { dot: "bg-pink-400", name: "" },   // Reading
  { dot: "bg-blue-400", name: "" },
  { dot: "bg-green-400", name: "" },
  { dot: "bg-purple-400", name: "" },
];

interface SidebarProps {
  activeSection: SidebarSection;
  onSectionChange: (s: SidebarSection) => void;
  onOpenSettings: () => void;
  notes: Note[];
}

function countBySource(notes: Note[], source: SourceType) {
  return notes.filter((n) => n.sourceType === source).length;
}

function getAllTags(notes: Note[]) {
  const tagMap: Record<string, number> = {};
  for (const note of notes) {
    for (const tag of note.tags) {
      tagMap[tag.title] = (tagMap[tag.title] ?? 0) + 1;
    }
  }
  return Object.entries(tagMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
}

// Nav row item used for the primary nav
function NavRow({
  icon,
  label,
  count,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 w-full px-2.5 py-[7px] rounded-lg text-[13px] transition-colors duration-100 text-left",
        isActive
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
      )}
    >
      <span
        className={cn(
          "shrink-0 w-4 flex items-center justify-center",
          isActive ? "text-blue-500" : "text-gray-400"
        )}
      >
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "text-xs tabular-nums",
            isActive ? "text-blue-500" : "text-gray-400"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// Spaces row — same but with count always shown
function SpaceRow({
  icon,
  label,
  count,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 w-full px-2.5 py-[7px] rounded-lg text-[13px] transition-colors duration-100 text-left",
        isActive
          ? "bg-blue-600 text-white font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
      )}
    >
      <span
        className={cn(
          "shrink-0 w-4 flex items-center justify-center",
          isActive ? "text-white" : "text-gray-400"
        )}
      >
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      <span
        className={cn(
          "text-xs tabular-nums font-medium",
          isActive ? "text-blue-100" : "text-gray-400"
        )}
      >
        {count}
      </span>
    </button>
  );
}

export function Sidebar({
  activeSection,
  onSectionChange,
  onOpenSettings,
  notes,
}: SidebarProps) {
  const tags = getAllTags(notes);
  const inboxCount = notes.filter((n) => {
    const d = new Date(n.createdAt);
    return Date.now() - d.getTime() < 86400000 * 2;
  }).length;

  return (
    <aside
      className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-colors"
      style={{ width: "var(--sidebar-width)" }}
      aria-label="Main navigation"
    >
      {/* ── Brand bar ── */}
      <div className="flex items-center justify-between px-4 h-[52px] border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          {/* Brain logo mark */}
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <circle cx="5" cy="5" r="3" fill="white" opacity="0.9" />
              <circle cx="10" cy="5" r="3" fill="white" opacity="0.9" />
              <circle cx="5" cy="10" r="3" fill="white" opacity="0.9" />
              <circle cx="10" cy="10" r="3" fill="white" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-[14px] tracking-tight">
            Second Brain
          </span>
        </div>
        <button
          type="button"
          aria-label="Sync"
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <CloudUpload size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* ── Go Premium ── */}
        <div className="mx-3 mt-3 mb-1">
          <button
            type="button"
            className="w-full flex items-start gap-2.5 p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors text-left"
          >
            <Star size={14} className="text-amber-500 shrink-0 mt-0.5" fill="currentColor" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 leading-none mb-1">
                Go Premium
              </p>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Unlock AI features, unlimited files, and much more.
              </p>
            </div>
            <ChevronRight size={14} className="text-gray-400 shrink-0 mt-0.5" />
          </button>
        </div>

        {/* ── Primary Nav ── */}
        <nav className="px-3 py-2 space-y-0.5" aria-label="Primary">
          <NavRow
            icon={<Inbox size={15} />}
            label="Inbox"
            count={inboxCount}
            isActive={activeSection === "inbox"}
            onClick={() => onSectionChange("inbox")}
          />
          <NavRow
            icon={<Sun size={15} />}
            label="Today"
            isActive={activeSection === "today"}
            onClick={() => onSectionChange("today")}
          />
          <NavRow
            icon={<LayoutList size={15} />}
            label="All Content"
            isActive={activeSection === "all" && false /* not highlighted here */}
            onClick={() => onSectionChange("all")}
          />
          <NavRow
            icon={<Heart size={15} />}
            label="Favorites"
            isActive={activeSection === "favorites"}
            onClick={() => onSectionChange("favorites")}
          />
          <NavRow
            icon={<Trash2 size={15} />}
            label="Trash"
            isActive={activeSection === "trash"}
            onClick={() => onSectionChange("trash")}
          />
        </nav>

        {/* ── My Spaces ── */}
        <div className="px-3 mt-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-2.5 mb-1.5">
            My Spaces
          </p>
          <nav className="space-y-0.5" aria-label="Spaces">
            <SpaceRow
              icon={<LayoutList size={15} />}
              label="All Content"
              count={notes.length}
              isActive={activeSection === "all"}
              onClick={() => onSectionChange("all")}
            />
            <SpaceRow
              icon={<FileText size={15} />}
              label="Notes"
              count={countBySource(notes, "INTERNAL")}
              isActive={activeSection === "notes"}
              onClick={() => onSectionChange("notes")}
            />
            <SpaceRow
              icon={<Newspaper size={15} />}
              label="Articles"
              count={countBySource(notes, "WEBSITE")}
              isActive={activeSection === "articles"}
              onClick={() => onSectionChange("articles")}
            />
            <SpaceRow
              icon={<SiYoutube size={15} />}
              label="Videos"
              count={countBySource(notes, "YOUTUBE")}
              isActive={activeSection === "videos"}
              onClick={() => onSectionChange("videos")}
            />
            <SpaceRow
              icon={<SiX size={15} />}
              label="Tweets"
              count={countBySource(notes, "TWITTER")}
              isActive={activeSection === "tweets"}
              onClick={() => onSectionChange("tweets")}
            />
            <SpaceRow
              icon={<FolderOpen size={15} />}
              label="Documents"
              count={
                countBySource(notes, "GOOGLE_DOC") +
                countBySource(notes, "NOTION")
              }
              isActive={activeSection === "documents"}
              onClick={() => onSectionChange("documents")}
            />
          </nav>
        </div>

        {/* ── Tags ── */}
        <div className="px-3 mt-4 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-2.5 mb-1.5">
            Tags
          </p>
          <div className="space-y-0.5">
            {tags.map(([tag, count], i) => (
              <button
                key={tag}
                type="button"
                className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors w-full text-left"
              >
                <span
                  className={cn(
                    "w-2.5 h-2.5 rounded-full shrink-0",
                    TAG_COLORS[i % TAG_COLORS.length].dot
                  )}
                  aria-hidden="true"
                />
                <span className="flex-1 truncate capitalize">{tag}</span>
                <span className="text-xs text-gray-400 tabular-nums">{count}</span>
              </button>
            ))}
            <button
              type="button"
              className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors w-full text-left"
            >
              <Plus size={13} className="shrink-0" />
              <span>New Tag</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom nav ── */}
      <div className="border-t border-gray-100 px-3 py-2 space-y-0.5 shrink-0">
        <NavRow
          icon={<Settings size={15} />}
          label="Settings"
          onClick={onOpenSettings}
        />
        <NavRow
          icon={<HelpCircle size={15} />}
          label="Help & Feedback"
          onClick={() => {}}
        />
      </div>
    </aside>
  );
}
