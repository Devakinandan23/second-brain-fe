"use client";

import { useState } from "react";
import { Download, FileJson, CheckCircle2, Loader2, AlertCircle, UploadCloud } from "lucide-react";
import { useRef } from "react";
import { useImportContent } from "@/lib/hooks/useContent";
import apiClient from "@/lib/api";
import { normalizeNoteTitle } from "@/lib/utils";

export function ExportSettings() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [importStatus, setImportStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importMutation = useImportContent();

  async function handleExport() {
    setStatus("loading");
    setErrorMsg(null);

    try {
      const res = await apiClient.get("/content/export", {
        responseType: "blob",
      });

      // Pull filename from Content-Disposition or fall back to a dated default
      const disposition: string = res.headers["content-disposition"] ?? "";
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match?.[1] ?? `second-brain-export-${new Date().toISOString().slice(0, 10)}.json`;

      const url = URL.createObjectURL(new Blob([res.data], { type: "application/json" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Export failed. Please try again.");
      setStatus("error");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus("loading");
    setImportMsg(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const json = JSON.parse(text);

        // Basic validation
        if (!json.entries || !Array.isArray(json.entries)) {
          throw new Error("Invalid format: Missing entries array");
        }

        const entries = (json.entries as Array<Record<string, unknown>>).map((entry) => ({
          ...entry,
          ...(typeof entry.title === "string"
            ? { title: normalizeNoteTitle(entry.title) }
            : {}),
        }));
        const res = await importMutation.mutateAsync({ ...json, entries });
        
        setImportStatus("success");
        setImportMsg(`Import complete: ${res.imported} imported, ${res.skipped} skipped, ${res.failed} failed.`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to parse or import data.";
        setImportStatus("error");
        setImportMsg(message);
      }
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.onerror = () => {
      setImportStatus("error");
      setImportMsg("Failed to read file.");
    };

    reader.readAsText(file);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Data Export & Import</h2>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Download all your entries as a single JSON file, or import a previously exported file.
        </p>
      </div>

      {/* Export card */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex items-start gap-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
          <FileJson size={18} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-gray-900 dark:text-white">All Entries (JSON)</p>
          <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
            Includes title, content, description, tags, source type, and timestamps.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={status === "loading"}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all shrink-0
            bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <><Loader2 size={13} className="animate-spin" /> Exporting...</>
          ) : (
            <><Download size={13} /> Export</>
          )}
        </button>
      </div>

      {/* Success / Error feedback */}
      {status === "success" && (
        <div className="flex items-center gap-2 text-[13px] text-green-600 dark:text-green-400 animate-in fade-in duration-200">
          <CheckCircle2 size={14} /> Export downloaded successfully!
        </div>
      )}
      {status === "error" && errorMsg && (
        <div className="flex items-center gap-2 text-[13px] text-red-600 dark:text-red-400 animate-in fade-in duration-200">
          <AlertCircle size={14} /> {errorMsg}
        </div>
      )}

      {/* Import card */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex items-start gap-4 bg-gray-50 dark:bg-gray-900/50 mt-4">
        <div className="w-10 h-10 bg-green-50 dark:bg-green-500/10 rounded-lg flex items-center justify-center shrink-0">
          <UploadCloud size={18} className="text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-gray-900 dark:text-white">Import Data (JSON)</p>
          <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
            Restore entries from a previous export. Duplicates are skipped.
          </p>
        </div>
        <div>
            <input 
                type="file" 
                accept=".json" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
            />
            <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={importStatus === "loading"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all shrink-0
                bg-green-600 hover:bg-green-700 text-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
            {importStatus === "loading" ? (
                <><Loader2 size={13} className="animate-spin" /> Importing...</>
            ) : (
                <><UploadCloud size={13} /> Import</>
            )}
            </button>
        </div>
      </div>

      {importStatus === "success" && importMsg && (
        <div className="flex items-center gap-2 text-[13px] text-green-600 dark:text-green-400 animate-in fade-in duration-200">
          <CheckCircle2 size={14} /> {importMsg}
        </div>
      )}
      {importStatus === "error" && importMsg && (
        <div className="flex items-center gap-2 text-[13px] text-red-600 dark:text-red-400 animate-in fade-in duration-200">
          <AlertCircle size={14} /> {importMsg}
        </div>
      )}

      {/* Info note */}
      <div className="rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-4 py-3">
        <p className="text-[12px] text-amber-700 dark:text-amber-400 leading-relaxed">
          <span className="font-semibold">Note:</span> The exported file contains all non-trashed entries and is meant for backup or migration purposes. Keep it safe — it includes your private notes.
        </p>
      </div>
    </div>
  );
}
