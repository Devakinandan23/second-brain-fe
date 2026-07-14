"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  User,
  Download,
  Palette,
  Settings,
  X,
  Info,
} from "lucide-react";
import { AccountSettings } from "./AccountSettings";
import { AppearanceSettings } from "./AppearanceSettings";
import { ExportSettings } from "./ExportSettings";
import { AboutSettings } from "./AboutSettings";
import { cn } from "@/lib/utils";

type SettingsSection =
  | "account"
  | "appearance"
  | "export"
  | "about"
  | "advanced";

interface SettingsNavItem {
  id: SettingsSection;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: SettingsNavItem[] = [
  { id: "account", label: "Account", icon: <User size={15} /> },
  { id: "appearance", label: "Appearance", icon: <Palette size={15} /> },
  { id: "export", label: "Export / Import", icon: <Download size={15} /> },
  { id: "about", label: "About", icon: <Info size={15} /> },
  { id: "advanced", label: "Advanced", icon: <Settings size={15} /> },
];

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  username: string;
}

export function SettingsDialog({ open, onClose, username }: SettingsDialogProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>("account");

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-in fade-in-0" />

        {/* Dialog */}
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "w-[640px] max-w-[95vw] h-[540px] max-h-[90vh]",
            "bg-white dark:bg-gray-950",
            "rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800",
            "flex min-h-0 flex-col md:flex-row overflow-hidden",
            "animate-in fade-in-0 zoom-in-95"
          )}
          aria-label="Settings"
        >
          {/* Left nav */}
          <nav
            className="w-full md:w-44 shrink-0 bg-gray-50 dark:bg-gray-900 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 flex flex-col py-2 px-2 md:py-4"
            aria-label="Settings sections"
          >
            <div className="flex items-center justify-between px-2 mb-2 md:mb-4">
              <div className="flex items-center gap-2">
                <Settings size={14} className="text-gray-400 dark:text-gray-500" aria-hidden="true" />
                <Dialog.Title className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Settings
                </Dialog.Title>
              </div>
              <Dialog.Close asChild className="md:hidden">
                <button type="button" aria-label="Close settings" className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 rounded-lg">
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex md:flex-col overflow-x-auto gap-1 md:gap-0 md:space-y-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {NAV_ITEMS.map(({ id, label, icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className={cn(
                    "shrink-0 flex items-center gap-2.5 px-3 md:px-2.5 py-2 rounded-lg text-sm transition-colors",
                    activeSection === id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  <span
                    className={cn(
                      activeSection === id
                        ? "text-blue-500 dark:text-blue-400"
                        : "text-gray-400 dark:text-gray-500"
                    )}
                  >
                    {icon}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </nav>

          {/* Right content */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            {/* Close button (desktop only) */}
            <div className="hidden md:flex items-center justify-end px-5 pt-4 pb-0 shrink-0">
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close settings"
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>

            {/* Section content */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
              {activeSection === "account" && (
                <AccountSettings username={username} />
              )}
              {activeSection === "appearance" && <AppearanceSettings />}
              {activeSection === "export" && <ExportSettings />}
              {activeSection === "about" && <AboutSettings />}
              {activeSection === "advanced" && (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-3">
                    <Settings size={18} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Advanced settings
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Coming soon</p>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
