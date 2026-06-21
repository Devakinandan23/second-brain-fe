"use client";

import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDeleteDialogProps {
  /** Text shown as the title of the dialog */
  title?: string;
  /** Sub-text describing the consequence */
  description: React.ReactNode;
  /** Label for the destructive confirm button */
  confirmLabel?: string;
  isConfirming: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Reusable confirmation dialog for destructive actions.
 * Rendered via a fixed overlay; clicking the backdrop dismisses it.
 */
export function ConfirmDeleteDialog({
  title = "Are you sure?",
  description,
  confirmLabel = "Delete forever",
  isConfirming,
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-4">
        {/* Icon + heading */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <h2
            id="confirm-delete-dialog-title"
            className="text-[15px] font-bold text-gray-900 dark:text-gray-100"
          >
            {title}
          </h2>
          <div className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
            {description}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            id="confirm-delete-dialog-cancel"
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            id="confirm-delete-dialog-confirm"
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-red-500 hover:bg-red-600 active:bg-red-700 text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isConfirming ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            {isConfirming ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
