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
import type { Note, SidebarSection, ViewMode } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState("User");
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Auth guard — client-side since JWT is in localStorage
  useEffect(() => {
    const token = localStorage.getItem("sb_token");
    const storedUsername = localStorage.getItem("sb_username");
    if (!token) {
      router.replace("/signin");
      return;
    }
    if (storedUsername) setUsername(storedUsername);
    setIsAuthChecked(true);
  }, [router]);

  // UI state
  const [activeSection, setActiveSection] = useState<SidebarSection>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  // ⌘K shortcut for search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
      // Escape clears selection
      if (e.key === "Escape" && selectedNote) {
        setSelectedNote(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedNote]);

  const handleSelectNote = useCallback((note: Note) => {
    setSelectedNote((prev) => (prev?.id === note.id ? null : note));
  }, []);

  const handleAddContent = useCallback(() => {
    setSelectedNote(null); // Show Quick Add panel
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
          onSectionChange={setActiveSection}
          onOpenSettings={() => setSettingsOpen(true)}
          notes={notes}
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
            className="flex flex-col bg-white dark:bg-gray-900 overflow-hidden shrink-0 transition-colors"
            style={{ width: contentWidth }}
          >
            <ContentList
              notes={notes}
              isLoading={isLoading}
              selectedNoteId={selectedNote?.id}
              onSelectNote={handleSelectNote}
              activeSection={activeSection}
              searchQuery={searchQuery}
            />
          </div>

          {/* Resizer */}
          <div
            className="w-1 cursor-col-resize hover:bg-blue-400 active:bg-blue-500 border-r border-gray-200 dark:border-gray-800 shrink-0 z-10 transition-colors"
            onMouseDown={startResize}
          />

          {/* Right panel: Quick Add or Detail View */}
          <div className="flex-1 overflow-hidden">
            {selectedNote ? (
              <DetailView
                note={selectedNote}
                onClose={() => setSelectedNote(null)}
              />
            ) : (
              <QuickAddPanel onSaved={() => {}} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
