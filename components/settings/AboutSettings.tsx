"use client";

import { Logo } from "@/components/common/Logo";

export function AboutSettings() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "v1.0.0";
  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE || "Unknown";
  const env = process.env.NODE_ENV === "development" ? "Development" : "Production";

  return (
    <div className="space-y-8 max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center shrink-0 text-white dark:text-gray-900 shadow-sm border border-gray-200 dark:border-gray-800">
          <Logo className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Second Brain</h2>
          <p className="text-[14px] text-gray-500 dark:text-gray-400 mt-1">Capture anything. Save everything.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Version</p>
          <p className="text-[14px] font-medium text-gray-900 dark:text-white">{version}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Environment</p>
          <p className="text-[14px] font-medium text-gray-900 dark:text-white">{env}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Build Date</p>
          <p className="text-[14px] font-medium text-gray-900 dark:text-white">{buildDate}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">License</p>
          <p className="text-[14px] font-medium text-gray-900 dark:text-white">MIT</p>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Built By</p>
        <p className="text-[14px] font-medium text-gray-900 dark:text-white">Devakinandan</p>
      </div>
    </div>
  );
}
