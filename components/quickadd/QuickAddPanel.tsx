"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Zap,
  Link2,
  FileText,
  Loader2,
  BookmarkPlus,
  ArrowLeft,
} from "lucide-react";
import { useContent, useCreateContent } from "@/lib/hooks/useContent";
import { cn } from "@/lib/utils";

type QuickAddTab = "link" | "note" | "screenshot" | "tweet";

interface FormValues {
  url: string;
  title: string;
  tagInput: string;
  notes: string;
}

interface QuickAddPanelProps {
  onSaved?: () => void;
  prefilledTag?: string | null;
  onClearPrefilledTag?: () => void;
  onClose?: () => void;
}

export function QuickAddPanel({ onSaved, prefilledTag, onClearPrefilledTag, onClose }: QuickAddPanelProps) {
  const [activeTab, setActiveTab] = useState<QuickAddTab>("link");
  const [tagPills, setTagPills] = useState<string[]>([]);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<FormValues>({
      defaultValues: { url: "", title: "", tagInput: "", notes: "" },
    });

  const { mutateAsync: createContent, isPending } = useCreateContent();
  const { data: notesData } = useContent();
  const notes = notesData || [];

  // Calculate top 5 most used tags
  const topTags = useCallback(() => {
    const tagMap: Record<string, number> = {};
    for (const note of notes) {
      for (const tag of note.tags) {
        tagMap[tag.title] = (tagMap[tag.title] ?? 0) + 1;
      }
    }
    return Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([title]) => title);
  }, [notes])();

  // Handle prefilled tag
  useEffect(() => {
    if (prefilledTag) {
      setTagPills((prev) => (prev.includes(prefilledTag) ? prev : [...prev, prefilledTag]));
    }
    return () => {
      if (prefilledTag) onClearPrefilledTag?.();
    };
  }, [prefilledTag, tagPills, onClearPrefilledTag]);
  const urlValue = watch("url");

  const handleUrlBlur = useCallback(async () => {
    const url = urlValue.trim();
    if (!url || !url.startsWith("http")) return;
    setIsFetchingMeta(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsFetchingMeta(false);
  }, [urlValue]);

  function commitTagInput() {
    const val = watch("tagInput").trim();
    if (!val) return;
    const newTags = val
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    setTagPills((prev) => [...new Set([...prev, ...newTags])]);
    setValue("tagInput", "");
  }

  function addSuggestedTag(tag: string) {
    setTagPills((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
  }

  async function onSubmit(data: FormValues) {
    setSubmitError(null);
    const url = data.url.trim();
    const title = data.title.trim();
    const notes = data.notes.trim();

    if (activeTab !== "note") {
      if (!url) { setSubmitError("Please paste a URL first."); return; }
      try { new URL(url); } catch {
        setSubmitError("Please enter a valid URL (e.g. https://...)");
        return;
      }
    }

    const finalTitle = title || (activeTab !== "note" ? url : "Untitled Note");
    if (activeTab === "note" && !finalTitle && !notes) {
      setSubmitError("Please add a title or write a note.");
      return;
    }

    try {
      await createContent({
        link: url || "https://second-brain.app/note",
        title: finalTitle,
        content: notes || null,
        authorName: null,
        tags: tagPills,
      });
      reset();
      setTagPills([]);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2000);
      onSaved?.();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = e?.response?.data?.message || e?.message || "Failed to save.";
      setSubmitError(
        msg.includes("validation") || msg.includes("extract")
          ? "Could not fetch metadata for that URL. Try adding a title manually."
          : msg
      );
    }
  }

  const TABS: { id: QuickAddTab; icon: React.ReactNode; label: string }[] = [
    { id: "link", icon: <Link2 size={13} />, label: "Link" },
    { id: "note", icon: <FileText size={13} />, label: "Note" },
  ];

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-950 p-8 transition-colors">
      <div className="max-w-[500px] mx-auto">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 transition-colors">
          {/* ── Header ── */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start gap-3">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-0.5 p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 md:hidden transition-colors"
                  aria-label="Back"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Zap size={16} className="text-amber-500" fill="currentColor" aria-hidden="true" />
                  <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">
                    Quick Add to Second Brain
                  </h2>
                </div>
                <p className="text-[13px] text-gray-500 dark:text-gray-400">
                  Capture anything. Save everything.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { reset(); setTagPills([]); setSubmitError(null); }}
              className="text-[12px] font-medium text-gray-500 dark:text-gray-400 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Clear
            </button>
          </div>

          <div className="mt-6">
            {/* ── Tabs ── */}
            <div
              className="flex gap-2 mb-6"
              role="tablist"
              aria-label="Content type"
            >
              {TABS.map(({ id, icon, label }) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={activeTab === id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 border",
                    activeTab === id
                      ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                      : "text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white dark:text-gray-400 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-800"
                  )}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>

            {/* ── Form ── */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              aria-label="Add content form"
            >
              {/* URL / note content */}
              {activeTab !== "note" ? (
                <div>
                  <div className="relative">
                    <input
                      {...register("url")}
                      type="url"
                      id="quick-add-url"
                      placeholder="Paste a link..."
                      onBlur={handleUrlBlur}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-[14px] text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all pr-8 bg-white dark:bg-gray-950 shadow-sm"
                    />
                    {isFetchingMeta && (
                      <Loader2
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin"
                        aria-label="Fetching metadata"
                      />
                    )}
                  </div>
                  <p className={cn(
                    "text-[12px] mt-2 px-1 font-medium",
                    isFetchingMeta ? "text-blue-500 animate-pulse" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {isFetchingMeta
                      ? "Fetching metadata…"
                      : "We'll fetch the title, description and more."}
                  </p>
                </div>
              ) : (
                <textarea
                  {...register("notes")}
                  id="quick-add-note-content"
                  placeholder="Write your note..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-[14px] text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 resize-none transition-all shadow-sm bg-white dark:bg-gray-950"
                />
              )}

              {/* Add Title */}
              <div>
                <label
                  htmlFor="quick-add-title"
                  className="block text-[14px] font-bold text-gray-900 dark:text-white mb-2"
                >
                  Add Title{" "}
                  <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  {...register("title")}
                  id="quick-add-title"
                  type="text"
                  placeholder="Give it a title (optional)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-[14px] text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all shadow-sm bg-white dark:bg-gray-950"
                />
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="quick-add-tags"
                  className="block text-[14px] font-bold text-gray-900 dark:text-white mb-2"
                >
                  Tags
                </label>

                {/* Active tag pills */}
                {tagPills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tagPills.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() =>
                            setTagPills((p) => p.filter((t) => t !== tag))
                          }
                          className="hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                          aria-label={`Remove ${tag}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <input
                  {...register("tagInput")}
                  id="quick-add-tags"
                  type="text"
                  placeholder="Add tags separated by comma"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      commitTagInput();
                    }
                  }}
                  onBlur={commitTagInput}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-[14px] text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all shadow-sm bg-white dark:bg-gray-950"
                />

                {/* Suggested tags */}
                {topTags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-3 px-1">
                    <span className="text-[12px] text-gray-500 dark:text-gray-400">Suggested:</span>
                    {topTags.filter((t) => !tagPills.includes(t)).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addSuggestedTag(tag)}
                        className="text-[11px] px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-full transition-colors font-semibold"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes textarea */}
              {activeTab !== "note" && (
                <div>
                  <label
                    htmlFor="quick-add-notes"
                    className="block text-[14px] font-bold text-gray-900 dark:text-white mb-2"
                  >
                    Notes{" "}
                    <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
                  </label>
                  <textarea
                    {...register("notes")}
                    id="quick-add-notes"
                    placeholder="Add any notes or thoughts..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-[14px] text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 resize-none transition-all shadow-sm bg-white dark:bg-gray-950"
                  />
                </div>
              )}

              {/* Error */}
              {submitError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl text-[13px] text-red-600 dark:text-red-400"
                >
                  <span className="shrink-0 mt-0.5">⚠</span>
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending || savedFeedback}
                className={cn(
                  "w-full flex items-center py-3.5 rounded-xl text-[14px] font-bold transition-all duration-150 shadow-sm relative",
                  savedFeedback
                    ? "bg-green-500 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                )}
              >
                {isPending ? (
                  <div className="flex items-center justify-center w-full gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Saving…
                  </div>
                ) : savedFeedback ? (
                  <div className="flex items-center justify-center w-full">✓ Saved!</div>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-full">
                      <BookmarkPlus size={16} className="mr-1.5" />
                      Save
                    </div>
                    <span className="absolute right-3 flex items-center gap-1 bg-blue-500/30 px-1.5 py-0.5 rounded text-[11px] font-medium text-white border border-blue-400/30">
                      <span>⌘</span> Enter
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        <p className="text-center text-[12px] text-gray-500 dark:text-gray-400 mt-6 font-medium">
          Tips: You can also use{" "}
          <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded text-gray-600 dark:text-gray-300 font-mono text-[11px]">
            ⌘ N
          </kbd>{" "}
          anywhere to quick add
        </p>
      </div>
    </div>
  );
}
