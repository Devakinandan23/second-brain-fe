"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { Settings, LogOut, User, Share2 } from "lucide-react";
import { ShareBrainDialog } from "./ShareBrainDialog";

interface UserMenuProps {
  username: string;
  onOpenSettings: () => void;
}

export function UserMenu({ username, onOpenSettings }: UserMenuProps) {
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("sb_token");
    localStorage.removeItem("sb_username");
    router.push("/signin");
  }

  const initials = username
    .split(/[\s_-]/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            aria-label="Open user menu"
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full"
          >
            <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-blue-600 cursor-pointer hover:opacity-90 transition-opacity">
              <Avatar.Fallback className="text-white text-xs font-semibold">
                {initials || "SB"}
              </Avatar.Fallback>
            </Avatar.Root>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={8}
            className="z-50 min-w-[200px] bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg p-1 animate-in fade-in-0 zoom-in-95"
          >
            <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
              <p className="text-xs font-medium text-gray-900 dark:text-white">{username}</p>
              <p className="text-xs text-gray-400">Personal Brain</p>
            </div>

            <DropdownMenu.Item
              onSelect={onOpenSettings}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-800 transition-colors"
            >
              <Settings size={14} className="text-gray-400" />
              Settings
            </DropdownMenu.Item>

            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-800 transition-colors"
            >
              <User size={14} className="text-gray-400" />
              Profile
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onSelect={() => setShareOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-800 transition-colors"
            >
              <Share2 size={14} className="text-gray-400" />
              Share Brain
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-800" />

            <DropdownMenu.Item
              onSelect={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer focus:outline-none focus:bg-red-50 dark:focus:bg-red-500/10 transition-colors"
            >
              <LogOut size={14} />
              Log out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <ShareBrainDialog open={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  );
}
