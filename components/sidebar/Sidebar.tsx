import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SidebarSection, Note, SourceType } from "@/lib/types";
import { SiYoutube, SiX } from "@icons-pack/react-simple-icons";
import { TagManagerDialog } from "@/components/tags";
import { Logo } from "@/components/common/Logo";
import { HelpFeedbackDialog } from "@/components/common/HelpFeedbackDialog";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Inbox,
  Sun,
  LayoutList,
  Heart,
  Trash2,
  FileText,
  Newspaper,
  FolderOpen,
  Settings,
  HelpCircle,
  Tag,
  Star,
  ChevronRight,
  CloudUpload,
  X,
} from "lucide-react";

interface SidebarProps {
  activeSection: SidebarSection;
  onSectionChange: (s: SidebarSection) => void;
  onOpenSettings: () => void;
  notes: Note[];
  activeTags: string[];
  onTagsSelect: (tags: string[]) => void;
  desktopOpen?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function countBySource(notes: Note[], source: SourceType) {
  return notes.filter((n) => n.sourceType === source).length;
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
          ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/20 dark:text-blue-400"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      )}
    >
      <span
        className={cn(
          "shrink-0 w-4 flex items-center justify-center",
          isActive ? "text-blue-500 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"
        )}
      >
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "text-xs tabular-nums",
            isActive ? "text-blue-500 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"
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
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      )}
    >
      <span
        className={cn(
          "shrink-0 w-4 flex items-center justify-center",
          isActive ? "text-white" : "text-gray-400 dark:text-gray-500"
        )}
      >
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      <span
        className={cn(
          "text-xs tabular-nums font-medium",
          isActive ? "text-blue-100" : "text-gray-400 dark:text-gray-500"
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
  activeTags,
  onTagsSelect,
  desktopOpen = true,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const [tagManagerOpen, setTagManagerOpen] = useState(false);
  const [helpFeedbackOpen, setHelpFeedbackOpen] = useState(false);
  const [now] = useState(() => Date.now());

  const inboxCount = notes.filter((n) => {
    const d = new Date(n.createdAt);
    return now - d.getTime() < 86400000 * 2;
  }).length;
  const favoritesCount = notes.filter((n) => n.isFavorite).length;

  const handleSectionClick = (section: SidebarSection) => {
    onSectionChange(section);
    if (onMobileClose) onMobileClose();
  };

  const SidebarInner = (
    <>
      {/* ── Brand bar ── */}
      <div className="flex items-center justify-between px-4 h-[52px] border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          {/* Brain logo mark */}
          <div className="w-7 h-7 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shrink-0 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-800">
            <Logo className="w-[18px] h-[18px]" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white text-[14px] tracking-tight">
            Second Brain
          </span>
        </div>
        <button
          type="button"
          aria-label="Sync"
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
        >
          <CloudUpload size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {/* ── Go Premium ── */}
        <div className="mx-3 mt-3 mb-1">
          <button
            type="button"
            className="w-full flex items-start gap-2.5 p-3 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/50 rounded-xl transition-colors text-left"
          >
            <Star size={14} className="text-amber-500 shrink-0 mt-0.5" fill="currentColor" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 dark:text-amber-100 leading-none mb-1">
                Go Premium
              </p>
              <p className="text-[11px] text-gray-500 dark:text-amber-200/70 leading-relaxed">
                Unlock AI features, unlimited files, and much more.
              </p>
            </div>
            <ChevronRight size={14} className="text-gray-400 dark:text-amber-500/50 shrink-0 mt-0.5" />
          </button>
        </div>

        {/* ── Primary Nav ── */}
        <nav className="px-3 py-2 space-y-0.5" aria-label="Primary">
          <NavRow
            icon={<Inbox size={15} />}
            label="Inbox"
            count={inboxCount}
            isActive={activeSection === "inbox"}
            onClick={() => handleSectionClick("inbox")}
          />
          <NavRow
            icon={<Sun size={15} />}
            label="Today"
            isActive={activeSection === "today"}
            onClick={() => handleSectionClick("today")}
          />
          <NavRow
            icon={<LayoutList size={15} />}
            label="All Content"
            isActive={activeSection === "all" && false /* not highlighted here */}
            onClick={() => handleSectionClick("all")}
          />
          <NavRow
            icon={<Heart size={15} />}
            label="Favorites"
            count={favoritesCount}
            isActive={activeSection === "favorites"}
            onClick={() => handleSectionClick("favorites")}
          />
          <NavRow
            icon={<Trash2 size={15} />}
            label="Trash"
            isActive={activeSection === "trash"}
            onClick={() => handleSectionClick("trash")}
          />
        </nav>

        {/* ── My Spaces ── */}
        <div className="px-3 mt-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-2.5 mb-1.5">
            My Spaces
          </p>
          <nav className="space-y-0.5" aria-label="Spaces">
            <SpaceRow
              icon={<LayoutList size={15} />}
              label="All Content"
              count={notes.length}
              isActive={activeSection === "all"}
              onClick={() => handleSectionClick("all")}
            />
            <SpaceRow
              icon={<FileText size={15} />}
              label="Notes"
              count={countBySource(notes, "INTERNAL")}
              isActive={activeSection === "notes"}
              onClick={() => handleSectionClick("notes")}
            />
            <SpaceRow
              icon={<Newspaper size={15} />}
              label="Articles"
              count={countBySource(notes, "WEBSITE")}
              isActive={activeSection === "articles"}
              onClick={() => handleSectionClick("articles")}
            />
            <SpaceRow
              icon={<SiYoutube size={15} />}
              label="Videos"
              count={countBySource(notes, "YOUTUBE")}
              isActive={activeSection === "videos"}
              onClick={() => handleSectionClick("videos")}
            />
            <SpaceRow
              icon={<SiX size={15} />}
              label="Tweets"
              count={countBySource(notes, "TWITTER")}
              isActive={activeSection === "tweets"}
              onClick={() => handleSectionClick("tweets")}
            />
            <SpaceRow
              icon={<FolderOpen size={15} />}
              label="Documents"
              count={
                countBySource(notes, "GOOGLE_DOC") +
                countBySource(notes, "NOTION")
              }
              isActive={activeSection === "documents"}
              onClick={() => handleSectionClick("documents")}
            />
          </nav>
        </div>

        {/* ── Filter by Tag trigger ── */}
        <div className="px-3 mt-2 pb-2">
          {activeTags.length > 0 ? (
            <div className="flex flex-col gap-1.5 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Filtered by tags
                </span>
                <button
                  type="button"
                  onClick={() => onTagsSelect([])}
                  className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-md transition-colors"
                  aria-label="Clear all filters"
                >
                  <X size={12} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {activeTags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-[12px] font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded flex-1 min-w-0">
                    <Tag size={10} className="shrink-0" />
                    <span className="truncate">{tag}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagsSelect(activeTags.filter((t) => t !== tag));
                      }}
                      className="ml-auto p-0.5 hover:bg-blue-200 dark:hover:bg-blue-500/40 rounded-sm shrink-0"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              
              <button
                type="button"
                onClick={() => setTagManagerOpen(true)}
                className="mt-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline text-left"
              >
                Edit filters...
              </button>
            </div>
          ) : (
            <NavRow
              icon={<Tag size={15} />}
              label="Filter by Tag"
              onClick={() => setTagManagerOpen(true)}
            />
          )}
        </div>

      </div>

      {/* ── Bottom nav ── */}
      <div className="border-t border-gray-100 dark:border-gray-800 px-3 py-2 space-y-0.5 shrink-0">
        <NavRow
          icon={<Settings size={15} />}
          label="Settings"
          onClick={() => {
            onOpenSettings();
            if (onMobileClose) onMobileClose();
          }}
        />
        <NavRow
          icon={<HelpCircle size={15} />}
          label="Help & Feedback"
          onClick={() => {
            setHelpFeedbackOpen(true);
            onMobileClose?.();
          }}
        />
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-colors",
          !desktopOpen && "md:hidden"
        )}
        style={{ width: "var(--sidebar-width)" }}
        aria-label="Main navigation"
      >
        {SidebarInner}
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <Dialog.Root open={mobileOpen} onOpenChange={(o) => !o && onMobileClose?.()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in-0 md:hidden" />
          <Dialog.Content
            className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white dark:bg-gray-900 shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left transition ease-in-out duration-300 md:hidden"
            aria-label="Mobile Navigation"
          >
            <Dialog.Title className="sr-only">Mobile Navigation</Dialog.Title>
            <Dialog.Description className="sr-only">Navigate your Second Brain</Dialog.Description>
            {SidebarInner}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <TagManagerDialog
        open={tagManagerOpen}
        onClose={() => setTagManagerOpen(false)}
        onApplyFilter={(tags) => {
          onTagsSelect(tags);
          onMobileClose?.();
        }}
        initialFilterTags={activeTags}
      />

      <HelpFeedbackDialog
        open={helpFeedbackOpen}
        onClose={() => setHelpFeedbackOpen(false)}
      />
    </>
  );
}
