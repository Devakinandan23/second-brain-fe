"use client";

import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Share2, X, Globe, Lock, Loader2 } from "lucide-react";
import { useShareLink, useToggleShareLink } from "@/lib/hooks/useShareBrain";
import { useContent } from "@/lib/hooks/useContent";
import { cn } from "@/lib/utils";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://secondbrain.app";

interface ShareBrainDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ShareBrainDialog({ open, onClose }: ShareBrainDialogProps) {
  const { data: shareData } = useShareLink();
  const { mutateAsync: toggleShare, isPending } = useToggleShareLink();
  const { data: notes = [] } = useContent();

  const [copied, setCopied] = useState(false);
  const shareLinkInputRef = useRef<HTMLInputElement>(null);
  const [isPublicOverride, setIsPublicOverride] = useState<boolean | null>(null);
  const isPublic = isPublicOverride ?? shareData?.isActive ?? false;

  const shareLink = shareData?.link
    ? `${typeof window !== "undefined" ? window.location.origin : BASE_URL}/s/${shareData.link}`
    : null;

  const publicNotesCount = notes.filter((n) => n.isPublic).length;

  async function handleToggle(nextPublic: boolean) {
    if (nextPublic === isPublic && shareData !== null) return;
    setIsPublicOverride(nextPublic);
    await toggleShare(nextPublic);
  }

  function handleCopy() {
    const input = shareLinkInputRef.current;
    if (!shareLink || !input) return;

    input.focus();
    input.select();
    input.setSelectionRange(0, shareLink.length);

    if (document.execCommand("copy")) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    void navigator.clipboard?.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // The selected input remains available for a manual copy if the browser blocks it.
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" />

        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md animate-in fade-in zoom-in-95 duration-200 outline-none"
          aria-describedby="share-brain-desc"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Share2 size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <Dialog.Title className="text-[16px] font-bold text-gray-900 dark:text-white">
                  Share Your Second Brain
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>

            {/* Body */}
            <div id="share-brain-desc" className="px-6 py-6 space-y-6">
              {/* Sharing Status */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                  Sharing Status
                </p>
                <div className="flex gap-3">
                  {/* Private */}
                  <button
                    type="button"
                    onClick={() => handleToggle(false)}
                    disabled={isPending}
                    className={cn(
                      "flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all",
                      !isPublic
                        ? "border-gray-800 dark:border-gray-200 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    <Lock size={14} className={!isPublic ? "text-gray-800 dark:text-gray-200" : "text-gray-400"} />
                    Private
                    {!isPublic && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-gray-800 dark:bg-gray-200" />
                    )}
                  </button>

                  {/* Public */}
                  <button
                    type="button"
                    onClick={() => handleToggle(true)}
                    disabled={isPending}
                    className={cn(
                      "flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all",
                      isPublic
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
                        : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    <Globe size={14} className={isPublic ? "text-blue-600 dark:text-blue-400" : "text-gray-400"} />
                    Public
                    {isPublic && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Share Link */}
              {isPublic && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                    Share Link
                  </p>

                  {isPending ? (
                    <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-400">
                      <Loader2 size={14} className="animate-spin" /> Generating link...
                    </div>
                  ) : shareLink ? (
                    <div className="flex items-center gap-2">
                      <input
                        ref={shareLinkInputRef}
                        type="text"
                        value={shareLink}
                        readOnly
                        onFocus={(event) => event.currentTarget.select()}
                        aria-label="Share link"
                        className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-[13px] text-gray-600 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      />
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="shrink-0 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                        aria-label="Copy share link"
                      >
                        {copied ? "Copied" : "Copy link"}
                      </button>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Footer stats */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[13px] text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{publicNotesCount}</span>{" "}
                  {publicNotesCount === 1 ? "note" : "notes"} marked as public
                </p>
                {isPending && (
                  <Loader2 size={13} className="animate-spin text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
