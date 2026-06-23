"use client";

import { useState } from "react";
import { Download, FileJson, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import apiClient from "@/lib/api";

export function ExportSettings() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Export</h2>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Download all your entries as a single JSON file. Trashed notes are not included.
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

      {/* Info note */}
      <div className="rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-4 py-3">
        <p className="text-[12px] text-amber-700 dark:text-amber-400 leading-relaxed">
          <span className="font-semibold">Note:</span> The exported file contains all non-trashed entries and is meant for backup or migration purposes. Keep it safe — it includes your private notes.
        </p>
      </div>
    </div>
  );
}
