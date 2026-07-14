"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Bug, ExternalLink, MessageSquare, Send, X } from "lucide-react";

const FEEDBACK_EMAIL = "nandandevaki6@gmail.com";
const PROFILE_URL = "https://linktr.ee/Devakinandan";

type FeedbackType = "bug" | "feedback";

interface HelpFeedbackDialogProps {
  open: boolean;
  onClose: () => void;
}

export function HelpFeedbackDialog({ open, onClose }: HelpFeedbackDialogProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("bug");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = feedbackType === "bug" ? "Second Brain bug report" : "Second Brain feedback";
    const body = message.trim() || "Please describe your bug or feedback here.";
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setMessage("");
    onClose();
  }

  return (
    <Dialog.Root open={open} onOpenChange={(value) => !value && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl outline-none dark:border-gray-800 dark:bg-gray-900"
          aria-describedby="help-feedback-description"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <MessageSquare size={17} aria-hidden="true" />
              </div>
              <div>
                <Dialog.Title className="text-[16px] font-bold text-gray-900 dark:text-white">
                  Help & Feedback
                </Dialog.Title>
                <Dialog.Description id="help-feedback-description" className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
                  Tell me about a bug or share an idea for Second Brain.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close help and feedback"
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <fieldset>
              <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Message type
              </legend>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackType("bug")}
                  aria-pressed={feedbackType === "bug"}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${feedbackType === "bug" ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"}`}
                >
                  <Bug size={15} /> Bug report
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType("feedback")}
                  aria-pressed={feedbackType === "feedback"}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${feedbackType === "feedback" ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"}`}
                >
                  <MessageSquare size={15} /> Feedback
                </button>
              </div>
            </fieldset>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Details
              </span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={5}
                placeholder="What happened or what would you like to see?"
                className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
            </label>

            <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
              <a
                href={PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Find me online <ExternalLink size={12} />
              </a>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <Send size={14} /> Open email
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
