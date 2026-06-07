"use client";

import { Search, Command } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
}

export function SearchBar({ value, onChange, onFocus }: SearchBarProps) {
  return (
    <div className="relative flex-1 max-w-md">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={15}
        aria-hidden="true"
      />
      <input
        id="global-search"
        type="search"
        role="searchbox"
        aria-label="Search your Second Brain"
        placeholder="Search anything..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        className="w-full pl-9 pr-20 py-2 text-sm bg-gray-100 border border-transparent rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all duration-150"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-gray-400">
        <Command size={11} />
        <span className="text-xs font-medium">K</span>
      </div>
    </div>
  );
}
