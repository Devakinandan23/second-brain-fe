"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  User,
  BookOpen,
  Download,
  Palette,
  Cpu,
  MessageSquare,
  FlaskConical,
  Settings,
  X,
} from "lucide-react";
import { AccountSettings } from "./AccountSettings";
import { AppearanceSettings } from "./AppearanceSettings";
import { cn } from "@/lib/utils";

type SettingsSection =
  | "account"
  | "entries"
  | "journals"
  | "import"
  | "appearance"
  | "prompts"
  | "ai"
  | "chat"
  | "advanced"
  | "labs";

interface SettingsNavItem {
  id: SettingsSection;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: SettingsNavItem[] = [
  { id: "account", label: "Account", icon: <User size={15} /> },
  { id: "entries", label: "Entries", icon: <BookOpen size={15} /> },
  { id: "journals", label: "Journals", icon: <BookOpen size={15} /> },
  { id: "import", label: "Import", icon: <Download size={15} /> },
  { id: "appearance", label: "Appearance", icon: <Palette size={15} /> },
  { id: "prompts", label: "Prompts", icon: <MessageSquare size={15} /> },
  { id: "ai", label: "AI Features", icon: <Cpu size={15} /> },
  { id: "chat", label: "Daily Chat", icon: <MessageSquare size={15} /> },
  { id: "advanced", label: "Advanced", icon: <Settings size={15} /> },
  { id: "labs", label: "Labs", icon: <FlaskConical size={15} /> },
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
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm animate-in fade-in-0" />

        {/* Dialog */}
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[640px] max-w-[95vw] h-[540px] max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex overflow-hidden animate-in fade-in-0 zoom-in-95"
          aria-label="Settings"
        >
          {/* Left nav */}
          <nav
            className="w-44 shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col py-4 px-2"
            aria-label="Settings sections"
          >
            <div className="flex items-center gap-2 px-2 mb-4">
              <Settings size={14} className="text-gray-400" aria-hidden="true" />
              <Dialog.Title className="text-sm font-semibold text-gray-900">
                Settings
              </Dialog.Title>
            </div>

            <div className="flex-1 space-y-0.5">
              {NAV_ITEMS.map(({ id, label, icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors text-left",
                    activeSection === id
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <span
                    className={cn(
                      activeSection === id ? "text-blue-500" : "text-gray-400"
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
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Close button */}
            <div className="flex items-center justify-end px-5 pt-4 pb-0 shrink-0">
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close settings"
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>

            {/* Section content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {activeSection === "account" && (
                <AccountSettings username={username} />
              )}
              {activeSection === "appearance" && <AppearanceSettings />}
              {activeSection !== "account" && activeSection !== "appearance" && (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                    <Settings size={18} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 capitalize">
                    {activeSection} settings
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Coming soon</p>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
