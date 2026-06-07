"use client";

import { PanelLeft, List, LayoutGrid, CalendarDays, Bell, Plus, ChevronDown, Search, Command } from "lucide-react";
import { UserMenu } from "@/components/common/UserMenu";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/lib/types";

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  username: string;
  onOpenSettings: () => void;
  onAddContent: () => void;
  onToggleSidebar?: () => void;
}

export function Header({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  username,
  onOpenSettings,
  onAddContent,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header className="flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 h-[52px] transition-colors">
      {/* Left: view toggles */}
      <div className="flex items-center gap-1" role="toolbar" aria-label="View mode">
        {/* Collapse/sidebar toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Collapse sidebar"
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <PanelLeft size={16} />
        </button>

        {/* Separator */}
        <span className="w-px h-4 bg-gray-200 mx-0.5" aria-hidden="true" />

        {/* List */}
        <button
          type="button"
          aria-label="List view"
          aria-pressed={viewMode === "list"}
          onClick={() => onViewModeChange("list")}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            viewMode === "list"
              ? "text-blue-600 bg-blue-50"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          )}
        >
          <List size={15} />
        </button>

        {/* Grid */}
        <button
          type="button"
          aria-label="Grid view"
          aria-pressed={viewMode === "grid"}
          onClick={() => onViewModeChange("grid")}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            viewMode === "grid"
              ? "text-blue-600 bg-blue-50"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          )}
        >
          <LayoutGrid size={15} />
        </button>

        {/* Calendar */}
        <button
          type="button"
          aria-label="Calendar view"
          aria-pressed={viewMode === "calendar"}
          onClick={() => onViewModeChange("calendar")}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            viewMode === "calendar"
              ? "text-blue-600 bg-blue-50"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          )}
        >
          <CalendarDays size={15} />
        </button>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center max-w-sm mx-auto">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={14}
            aria-hidden="true"
          />
          <input
            id="global-search"
            type="search"
            role="searchbox"
            aria-label="Search your Second Brain"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-14 py-1.5 text-[13px] bg-gray-100 border border-transparent rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all duration-150"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-gray-400">
            <Command size={10} />
            <span className="text-[11px] font-medium">K</span>
          </div>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Bell size={16} />
        </button>

        <UserMenu username={username} onOpenSettings={onOpenSettings} />

        {/* Add Content unified button */}
        <button
          id="add-content-btn"
          type="button"
          onClick={onAddContent}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium px-3.5 py-1.5 rounded-lg shadow-sm transition-colors duration-150"
        >
          Add Content
          <ChevronDown size={14} className="opacity-80" />
        </button>
      </div>
    </header>
  );
}
