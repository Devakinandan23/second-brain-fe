"use client";

import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { Settings, LogOut, User } from "lucide-react";

interface UserMenuProps {
  username: string;
  onOpenSettings: () => void;
}

export function UserMenu({ username, onOpenSettings }: UserMenuProps) {
  const router = useRouter();

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
          className="z-50 min-w-[180px] bg-white rounded-xl border border-gray-200 shadow-lg p-1 animate-in fade-in-0 zoom-in-95"
        >
          <div className="px-3 py-2 border-b border-gray-100 mb-1">
            <p className="text-xs font-medium text-gray-900">{username}</p>
            <p className="text-xs text-gray-400">Personal Brain</p>
          </div>

          <DropdownMenu.Item
            onSelect={onOpenSettings}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer focus:outline-none focus:bg-gray-50 transition-colors"
          >
            <Settings size={14} className="text-gray-400" />
            Settings
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer focus:outline-none focus:bg-gray-50 transition-colors"
          >
            <User size={14} className="text-gray-400" />
            Profile
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-gray-100" />

          <DropdownMenu.Item
            onSelect={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 cursor-pointer focus:outline-none focus:bg-red-50 transition-colors"
          >
            <LogOut size={14} />
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
