"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, RotateCcw, Loader2, PackageOpen } from "lucide-react";
import { SiYoutube, SiX, SiNotion, SiGoogledocs } from "@icons-pack/react-simple-icons";
import { FileText, Link2 } from "lucide-react";
import { cn, formatTime, getDayLabel } from "@/lib/utils";
import { groupNotesByDate } from "@/lib/utils";
import { getTagColor } from "@/components/common/Tag";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { useTrash, useRestoreFromTrash, usePermanentlyDelete } from "@/lib/hooks/useTrash";
import type { Note, SourceType } from "@/lib/types";

// ── Source icon (mirrors ContentCard) ───────────────────────────────────────
function SourceIcon({ type }: { type: SourceType }) {
  switch (type) {
    case "YOUTUBE":
      return <span className="shrink-0 text-[#FF0000]"><SiYoutube size={14} /></span>;
    case "TWITTER":
      return <span className="shrink-0 text-black dark:text-white"><SiX size={14} /></span>;
    case "NOTION":
      return <span className="shrink-0 text-black dark:text-white"><SiNotion size={14} /></span>;
    case "GOOGLE_DOC":
      return <span className="shrink-0 text-[#4285F4]"><SiGoogledocs size={14} /></span>;
    case "WEBSITE":
      return <span className="shrink-0 text-gray-400"><Link2 size={14} /></span>;
    case "INTERNAL":
      return <span className="shrink-0 text-gray-400"><FileText size={14} /></span>;
  }
}

// ── Tag pill ─────────────────────────────────────────────────────────────────
function TagPill({ label }: { label: string }) {
  const { bg, text } = getTagColor(label);
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
        bg,
        text
      )}
    >
      {label}
    </span>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex items-start gap-4 px-6 py-2.5 animate-pulse">
      <div className="flex flex-col items-center w-8 shrink-0 pt-3 gap-1">
        <div className="h-2 w-5 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-6 w-7 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="flex-1 p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-2">
        <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/5" />
        <div className="h-4 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" />
      </div>
    </div>
  );
}


// ── Single trash card ─────────────────────────────────────────────────────────
interface TrashCardProps {
  note: Note;
  onRestore: (id: string) => void;
  onDelete: (note: Note) => void;
  isRestoring: boolean;
}

function TrashCard({ note, onRestore, onDelete, isRestoring }: TrashCardProps) {
  const { day, weekday } = getDayLabel(note.createdAt);
  const firstTag = note.tags[0];

  return (
    <div className="flex items-start gap-4 px-6 py-2.5">
      {/* Date column */}
      <div className="flex flex-col items-center w-8 shrink-0 pt-3">
        <span className="text-[10px] font-bold text-gray-400 uppercase leading-none tracking-wider mb-1">
          {weekday}
        </span>
        <span className="text-[18px] font-bold text-gray-400 leading-none tabular-nums">
          {day}
        </span>
      </div>

      {/* Card */}
      <article
        className="flex-1 flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 opacity-75 hover:opacity-100 transition-opacity"
      >
        {/* Source icon */}
        <div className="shrink-0 pt-0.5 w-[18px] flex justify-center">
          <SourceIcon type={note.sourceType} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-[14px] font-bold leading-snug mb-2 line-clamp-2 text-gray-600 dark:text-gray-400">
            {note.title}
          </h3>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[12px] font-medium text-gray-400">
              {formatTime(note.createdAt)}
            </span>
            {firstTag && <TagPill label={firstTag.title} />}
          </div>
        </div>

        {/* Thumbnail */}
        {note.thumbnail && (
          <div className="shrink-0 w-[84px] h-[56px] rounded-lg overflow-hidden border border-gray-100 bg-gray-50 opacity-60">
            <Image
              src={note.thumbnail}
              alt=""
              width={84}
              height={56}
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Actions */}
        <div className="shrink-0 flex flex-col gap-2 ml-1">
          <button
            id={`trash-restore-${note.id}`}
            type="button"
            onClick={() => onRestore(note.id)}
            disabled={isRestoring}
            title="Restore"
            aria-label={`Restore "${note.title}"`}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors disabled:opacity-40"
          >
            {isRestoring ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <RotateCcw size={15} />
            )}
          </button>
          <button
            id={`trash-delete-${note.id}`}
            type="button"
            onClick={() => onDelete(note)}
            title="Delete forever"
            aria-label={`Permanently delete "${note.title}"`}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </article>
    </div>
  );
}

// ── TrashList (exported) ──────────────────────────────────────────────────────
export function TrashList() {
  const { data: trashedNotes = [], isLoading } = useTrash();
  const { mutate: restore, isPending: isRestoring, variables: restoringId } = useRestoreFromTrash();
  const { mutate: deleteForever, isPending: isDeleting } = usePermanentlyDelete();

  const [confirmNote, setConfirmNote] = useState<Note | null>(null);

  const handleDelete = (note: Note) => setConfirmNote(note);

  const handleConfirmDelete = () => {
    if (!confirmNote) return;
    deleteForever(confirmNote.id, {
      onSuccess: () => setConfirmNote(null),
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (trashedNotes.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-3">
          <PackageOpen size={20} className="text-gray-400" />
        </div>
        <p className="text-[13px] font-medium text-gray-600 dark:text-gray-400 mb-1">
          Trash is empty
        </p>
        <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
          Items you delete will appear here before being permanently removed
        </p>
      </div>
    );
  }

  const groups = groupNotesByDate(trashedNotes);

  return (
    <>
      {/* Header banner */}
      <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 bg-red-50/60 dark:bg-red-950/20">
        <p className="text-[12px] text-red-600 dark:text-red-400 font-medium flex items-center gap-1.5">
          <Trash2 size={12} />
          Items in trash are not shown in your brain. Restore or delete them forever.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto" role="list" aria-label="Trash">
        {groups.map(({ date, items }) => (
          <div key={date} role="group" aria-label={date}>
            <div className="px-4 pt-4 pb-2">
              <h2 className="text-[13px] font-bold text-gray-800 dark:text-gray-200">{date}</h2>
            </div>
            {items.map((note) => (
              <TrashCard
                key={note.id}
                note={note}
                onRestore={(id) => restore(id)}
                onDelete={handleDelete}
                isRestoring={isRestoring && restoringId === note.id}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Confirm dialog */}
      {confirmNote && (
        <ConfirmDeleteDialog
          title="Permanently delete?"
          description={
            <>
              <span className="font-medium text-gray-700 dark:text-gray-300 line-clamp-1">
                &ldquo;{confirmNote.title}&rdquo;
              </span>{" "}
              will be permanently deleted and cannot be recovered.
            </>
          }
          confirmLabel="Delete forever"
          isConfirming={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmNote(null)}
        />
      )}
    </>
  );
}
