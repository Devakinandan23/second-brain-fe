"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Header } from "@/components/header/Header";
import { ContentList } from "@/components/content/ContentList";
import { QuickAddPanel } from "@/components/quickadd/QuickAddPanel";
import { DetailView } from "@/components/detail/DetailView";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { useContent } from "@/lib/hooks/useContent";
import { cn } from "@/lib/utils";
import type { Note, SidebarSection, ViewMode } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sb_username") || "User";
    }
    return "User";
  });
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Auth guard — client-side since JWT is in localStorage
  useEffect(() => {
    const token = localStorage.getItem("sb_token");
    if (!token) {
      router.replace("/signin");
      return;
    }
    // Avoid calling setState synchronously in effect
    const timer = setTimeout(() => setIsAuthChecked(true), 0);
    return () => clearTimeout(timer);
  }, [router]);

  // UI state
  const [activeSection, setActiveSection] = useState<SidebarSection>("all");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [prefilledTag, setPrefilledTag] = useState<string | null>(null);

  // Resize logic
  const [contentWidth, setContentWidth] = useState(420);

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = contentWidth;

    function onMouseMove(moveEvent: MouseEvent) {
      const deltaX = moveEvent.clientX - startX;
      setContentWidth(Math.min(Math.max(startWidth + deltaX, 280), 800));
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
    }

    document.body.style.cursor = "col-resize";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, [contentWidth]);

  // Data
  const { data: notes = [], isLoading } = useContent();

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  // ⌘K shortcut for search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedNoteId) setSelectedNoteId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedNoteId]);

  const handleSectionChange = useCallback((s: SidebarSection) => {
    setActiveSection(s);
  }, []);

  const handleSelectNote = useCallback((note: Note) => {
    setSelectedNoteId((prev) => (prev === note.id ? null : note.id));
  }, []);

  const handleAddContent = useCallback(() => {
    setSelectedNoteId(null);
    setPrefilledTag(null);
  }, []);

  if (!isAuthChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAFA] dark:bg-gray-950">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-950 transition-colors">
      {/* Settings dialog */}
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        username={username}
      />

      {/* Left: Sidebar */}
      {isSidebarOpen && (
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onOpenSettings={() => setSettingsOpen(true)}
          notes={notes}
          activeTags={activeTags}
          onTagsSelect={setActiveTags}
        />
      )}

      {/* Center + Right: main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header spans the full remaining width */}
        <Header
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          username={username}
          onOpenSettings={() => setSettingsOpen(true)}
          onAddContent={handleAddContent}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Content list */}
          <div
            className={cn(
              "flex flex-col bg-white dark:bg-gray-900 overflow-hidden transition-colors",
              (viewMode !== "list" && !selectedNote) ? "flex-1" : "shrink-0"
            )}
            style={(viewMode !== "list" && !selectedNote) ? undefined : { width: contentWidth }}
          >
            <ContentList
              notes={notes}
              isLoading={isLoading}
              selectedNoteId={selectedNoteId}
              onSelectNote={handleSelectNote}
              activeSection={activeSection}
              activeTags={activeTags}
              searchQuery={searchQuery}
              viewMode={viewMode}
            />
          </div>

          {/* Resizer - only show if right panel is visible */}
          {(viewMode === "list" || selectedNote) && (
            <div
              className="w-1 cursor-col-resize hover:bg-blue-400 active:bg-blue-500 border-r border-gray-200 dark:border-gray-800 shrink-0 z-10 transition-colors"
              onMouseDown={startResize}
            />
          )}

          {/* Right panel: Quick Add or Detail View */}
          {/* In list view, always show right panel (Detail or QuickAdd) */}
          {/* In grid/calendar view, only show right panel if a note is selected */}
          {(viewMode === "list" || selectedNote) && (
            <div className="flex-1 overflow-hidden">
              {selectedNote ? (
                <DetailView
                  note={selectedNote}
                  onClose={() => setSelectedNoteId(null)}
                />
              ) : (
                <QuickAddPanel 
                  onSaved={() => {}} 
                  prefilledTag={prefilledTag} 
                  onClearPrefilledTag={() => setPrefilledTag(null)} 
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
