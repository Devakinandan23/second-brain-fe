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

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("sb_token");
    if (!token) {
      router.replace("/signin");
      return;
    }
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileQuickAddOpen, setIsMobileQuickAddOpen] = useState(false);
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

  // Shortcuts
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
    setIsMobileQuickAddOpen(false);
  }, []);

  const handleSelectNote = useCallback((note: Note) => {
    setSelectedNoteId((prev) => (prev === note.id ? null : note.id));
    setIsMobileQuickAddOpen(false);
  }, []);

  const handleAddContent = useCallback(() => {
    setSelectedNoteId(null);
    setPrefilledTag(null);
    setIsMobileQuickAddOpen(true);
  }, []);

  if (!isAuthChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAFA] dark:bg-gray-950 transition-colors">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // To prevent inline style breaking responsive design, only apply explicit width when on desktop md+ breakpoint.
  // Using a custom CSS variable or conditionally ignoring it is easiest. We'll use CSS for responsive width where possible,
  // but since we rely on style={{ width: contentWidth }}, we must be careful not to force 420px on mobile.
  // On mobile (max-width: 768px), the list should take 100% width if shown. We can rely on flex-1 to override style in flex container,
  // or set width conditionally using a hook. A simpler trick: use style width but override with max-width: 100% in classes.

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-950 transition-colors">
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        username={username}
      />

      {/* Sidebar handles both desktop and mobile modes internally */}
      {isSidebarOpen && (
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onOpenSettings={() => setSettingsOpen(true)}
          notes={notes}
          activeTags={activeTags}
          onTagsSelect={(tags) => {
            setActiveTags(tags);
            setIsMobileQuickAddOpen(false);
          }}
          mobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Center + Right: main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          username={username}
          onOpenSettings={() => setSettingsOpen(true)}
          onAddContent={handleAddContent}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Content list */}
          <div
            className={cn(
              "flex flex-col bg-white dark:bg-gray-900 overflow-hidden transition-colors !max-w-full",
              // Mobile logic: hide list if a note is selected OR quick add is open
              (selectedNote || isMobileQuickAddOpen) ? "hidden md:flex" : "flex-1",
              // Desktop logic: either take all space or fixed width shrink-0
              (viewMode !== "list" && !selectedNote) ? "md:flex-1" : "md:shrink-0"
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

          {/* Resizer - only show if right panel is visible ON DESKTOP */}
          {(viewMode === "list" || selectedNote) && (
            <div
              className="hidden md:block w-1 cursor-col-resize hover:bg-blue-400 active:bg-blue-500 border-r border-gray-200 dark:border-gray-800 shrink-0 z-10 transition-colors"
              onMouseDown={startResize}
            />
          )}

          {/* Right panel: Quick Add or Detail View */}
          {(viewMode === "list" || selectedNote || isMobileQuickAddOpen) && (
            <div className={cn(
              "flex-1 overflow-hidden",
              // On mobile: only show block if a note is selected or quick add is open.
              (!selectedNote && !isMobileQuickAddOpen) ? "hidden md:block" : "block"
            )}>
              {selectedNote ? (
                <DetailView
                  note={selectedNote}
                  onClose={() => setSelectedNoteId(null)}
                />
              ) : (
                <QuickAddPanel 
                  onSaved={() => setIsMobileQuickAddOpen(false)} 
                  prefilledTag={prefilledTag} 
                  onClearPrefilledTag={() => setPrefilledTag(null)}
                  onClose={() => setIsMobileQuickAddOpen(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
