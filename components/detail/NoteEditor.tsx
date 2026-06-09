"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Check, Loader2 } from "lucide-react";
import type { Note } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AnimatedSaveButton } from "./AnimatedSaveButton";

interface NoteEditorProps {
  initialTitle: string;
  initialContent: string;
  editorType: "content" | "description";
  onSave: (updatedTitle: string, updatedContent: string) => Promise<void>;
  onClose: () => void;
}

export function NoteEditor({ initialTitle, initialContent, editorType, onSave, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const lastSavedData = useRef({ title: initialTitle, content: initialContent });

  const handleSave = useCallback(async () => {
    if (title === lastSavedData.current.title && content === lastSavedData.current.content) {
      return; // No changes to save
    }
    setSaveStatus("saving");
    try {
      await onSave(title, content);
      lastSavedData.current = { title, content };
      setSaveStatus("saved");
      setTimeout(() => {
        setSaveStatus((prev) => (prev === "saved" ? "idle" : prev));
      }, 2000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    }
  }, [title, content, onSave]);

  // Keyboard shortcut: Cmd+S / Ctrl+S
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSave]);

  // Autosave after 2 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== lastSavedData.current.title || content !== lastSavedData.current.content) {
        handleSave();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [title, content, handleSave]);

  return (
    <div className="fixed inset-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm flex justify-center items-center p-4 sm:p-8 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-full max-h-[90vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
            {editorType === "description" ? "Description Editor" : "Note Editor"}
          </h2>
            
            {/* Autosave Indicator */}
            <div className="flex items-center gap-1.5 text-xs font-medium">
              {saveStatus === "saving" && (
                <span className="text-blue-500 flex items-center gap-1.5">
                  <Loader2 size={12} className="animate-spin" /> Saving...
                </span>
              )}
              {saveStatus === "error" && (
                <span className="text-red-500 flex items-center gap-1">
                  Error saving
                </span>
              )}
              {title === lastSavedData.current.title && content === lastSavedData.current.content && saveStatus !== "saving" && saveStatus !== "error" && (
                <span className="text-green-500 flex items-center gap-1">
                  <Check size={12} /> Saved
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AnimatedSaveButton
              onClick={handleSave}
              isSaving={saveStatus === "saving"}
            />
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close Editor"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-950 p-8 sm:p-12">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="text-3xl font-bold text-gray-900 dark:text-gray-100 bg-transparent outline-none focus:outline-none focus:ring-0 focus:border-transparent border-transparent placeholder-gray-300 dark:placeholder-gray-700 mb-6 shadow-none focus:shadow-none !border-none !ring-0 !outline-none"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={editorType === "description" ? "Write your description here... (Markdown supported)" : "Write your markdown note here... (Markdown supported)"}
            className="flex-1 w-full text-base leading-relaxed text-gray-700 dark:text-gray-300 bg-transparent outline-none focus:outline-none focus:ring-0 focus:border-transparent border-transparent resize-none placeholder-gray-400 dark:placeholder-gray-600 shadow-none focus:shadow-none !border-none !ring-0 !outline-none"
          />
        </div>
        
        {/* Footer Shortcut hint */}
        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50 dark:bg-gray-900/80 flex items-center justify-between text-xs text-gray-500">
          <span>Markdown formatting is supported</span>
          <span className="flex items-center gap-1">
            Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300 font-sans">Cmd</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300 font-sans">S</kbd> to save
          </span>
        </div>
      </div>
    </div>
  );
}
