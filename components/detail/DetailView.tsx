"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Edit3,
  Star,
  MoreHorizontal,
  Globe,
  Clock,
  Calendar,
  ExternalLink,
  FileText,
  Plus,
  Lock,
  Unlock,
  Maximize2,
  X,
  Trash2,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Tag } from "@/components/common/Tag";
import { TagAutocompleteInput } from "@/components/common/TagAutocompleteInput";
import { ToggleSwitch } from "@/components/common/ToggleSwitch";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { TagManagerDialog } from "@/components/tags";
import { NoteEditor } from "./NoteEditor";
import { cn, formatDate, getSourceLabel, extractDomain } from "@/lib/utils";
import { SiYoutube, SiX, SiNotion, SiGoogledocs } from "@icons-pack/react-simple-icons";
import type { Note, SourceType } from "@/lib/types";
import { useContent, useDeleteContent, useUpdateContent } from "@/lib/hooks/useContent";

const SOURCE_ICONS: Record<SourceType, React.ReactNode> = {
  YOUTUBE: <SiYoutube size={18} className="text-[#FF0000]" />,
  TWITTER: <SiX size={18} className="text-black" />,
  NOTION: <SiNotion size={18} className="text-black" />,
  GOOGLE_DOC: <SiGoogledocs size={18} className="text-[#4285F4]" />,
  WEBSITE: <Globe size={18} className="text-violet-500" />,
  INTERNAL: <FileText size={18} className="text-amber-500" />,
};

type DetailTab = "overview" | "notes" | "transcript" | "comments";

interface DetailViewProps {
  note: Note;
  onClose: () => void;
}

// Custom date formatter to match screenshot exactly
function formatExactDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const month = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  const year = d.getFullYear();
  const time = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  return `${month} ${day}, ${year} at ${time}`;
}


export function DetailView({ note, onClose }: DetailViewProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editDescription, setEditDescription] = useState(note.description || "");
  const [editContent, setEditContent] = useState(note.content || "");
  const [editTags, setEditTags] = useState<string[]>(note.tags.map((t) => t.title));
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorTarget, setEditorTarget] = useState<"content" | "description" | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);

  const { mutateAsync: updateContent, isPending: isUpdating } = useUpdateContent();
  const { mutateAsync: deleteContent, isPending: isDeleting } = useDeleteContent();

  async function handleSave() {
    try {
      await updateContent({
        id: note.id,
        data: {
          title: editTitle,
          description: editDescription,
          content: editContent,
          tags: editTags,
        },
      });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save changes.");
    }
  }

  async function handleDelete() {
    try {
      await deleteContent({ id: note.id });
      // Close the detail panel — the item no longer exists in the main content list
      onClose();
    } catch (e) {
      console.error(e);
      alert("Failed to delete.");
    }
  }

  async function handleToggleVisibility() {
    try {
      await updateContent({
        id: note.id,
        data: {
          isPublic: !note.isPublic,
        },
      });
    } catch (e) {
      console.error(e);
      alert("Failed to update visibility.");
    }
  }

  async function handleToggleFavorite(newState: boolean) {
    try {
      await updateContent({
        id: note.id,
        data: {
          isFavorite: newState,
        },
      });
    } catch (e) {
      console.error(e);
      alert("Failed to update favorite status.");
    }
  }

  const DETAIL_TABS: { id: DetailTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "notes", label: "Notes" },
    { id: "transcript", label: "Transcript" },
    { id: "comments", label: "Comments" },
  ];

  // Parse content/metadata for display
  const contentLines = note.content
    ? note.content.split(/\n+/).filter(Boolean)
    : [];

  const durationMeta =
    note.metadata && typeof note.metadata === "object"
      ? (note.metadata as Record<string, unknown>)
      : {};
  const duration = durationMeta.duration as string | undefined;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 shrink-0">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to quick add"
          className="p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditTitle(note.title);
                setEditDescription(note.description || "");
                setEditContent(note.content || "");
                setEditTags(note.tags.map((t) => t.title));
                setIsEditing(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <Edit3 size={14} /> Edit
            </button>
          )}
          <button
            type="button"
            aria-label="Favorite"
            onClick={() => handleToggleFavorite(!note.isFavorite)}
            disabled={isUpdating}
            className={cn(
              "p-1.5 border border-gray-200 rounded-lg transition-colors shadow-sm dark:border-gray-700 disabled:opacity-50",
              note.isFavorite 
                ? "text-amber-500 bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 border-amber-200 dark:border-amber-500/30" 
                : "text-gray-500 bg-white hover:bg-gray-50 hover:text-amber-500 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
            )}
          >
            <Star size={16} className={note.isFavorite ? "fill-current" : ""} />
          </button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                aria-label="More options"
                className="p-1.5 text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenu.Trigger>
            
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="w-40 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-1 animate-in fade-in zoom-in-95 duration-200"
              >
                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg cursor-pointer outline-none transition-colors"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 size={14} /> Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8">
        {/* Header Section (Title, Tags, Meta, Thumbnail) */}
        <div className="flex items-start justify-between gap-8 mb-8">
          {/* Left side */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="flex items-start gap-3 mb-4">
              <span className="mt-1.5 shrink-0" aria-hidden="true">
                {SOURCE_ICONS[note.sourceType]}
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-[28px] font-bold text-gray-900 dark:text-white leading-tight tracking-tight bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-blue-500"
                  placeholder="Note Title"
                />
              ) : (
                <h1 className="text-[28px] font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                  {note.title}
                </h1>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {isEditing ? (
                <>
                  {editTags.map((tag) => (
                    <div key={tag} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full text-[13px] font-medium text-gray-700 dark:text-gray-300">
                      {tag}
                      <button type="button" onClick={() => setEditTags(editTags.filter(t => t !== tag))} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <TagAutocompleteInput editTags={editTags} setEditTags={setEditTags} />
                </>
              ) : (
                <>
                  {note.tags.map((tag) => (
                    <Tag key={tag.id} label={tag.title} colored />
                  ))}
                  <button
                    type="button"
                    aria-label="Manage tags"
                    onClick={() => setIsTagManagerOpen(true)}
                    className="flex items-center justify-center w-7 h-7 text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <Plus size={14} />
                  </button>
                </>
              )}
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-6 text-sm text-gray-700 dark:text-gray-300 font-medium">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-gray-500 dark:text-gray-400" />
                <span>{formatExactDate(note.createdAt)}</span>
              </div>
              {note.link && (
                <div className="flex items-center gap-2">
                  <Globe size={15} className="text-gray-500 dark:text-gray-400" />
                  <span>{extractDomain(note.link)}</span>
                </div>
              )}
              {duration && (
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-gray-500 dark:text-gray-400" />
                  <span>{duration}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right side: Thumbnail */}
          {note.thumbnail && (
            <div className="shrink-0 w-[280px] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <Image
                src={note.thumbnail}
                alt=""
                width={280}
                height={158}
                className="w-full object-cover aspect-video"
              />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
          <div className="flex gap-8 -mb-px" role="tablist">
            {DETAIL_TABS.map(({ id, label }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "pb-4 text-[15px] font-medium transition-colors border-b-2",
                  activeTab === id
                    ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                    : "text-gray-500 border-transparent hover:text-gray-800 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div role="tabpanel">
          {activeTab === "overview" && (
            <div className="grid grid-cols-[1fr_320px] gap-6 items-start">
              
              {/* Left Column */}
              <div className="flex flex-col gap-6">
                {/* Description Card */}
                {(note.description || isEditing) && (
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">
                        Description
                      </h3>
                      {!isEditing && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setEditTitle(note.title);
                              setEditDescription(note.description || "");
                              setEditContent(note.content || "");
                              setEditTags(note.tags.map((t) => t.title));
                              setIsEditing(true);
                            }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              setEditorTarget("description");
                              setIsEditorOpen(true);
                            }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            <Maximize2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                      {isEditing ? (
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full h-24 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Add a description..."
                        />
                      ) : (
                        <p className={cn(!isDescriptionExpanded && "line-clamp-3")}>
                          {note.description}
                        </p>
                      )}
                    </div>
                    {!isEditing && note.description && note.description.length > 150 && (
                      <button 
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="mt-4 text-[14px] text-blue-600 dark:text-blue-400 font-medium hover:underline"
                      >
                        {isDescriptionExpanded ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                )}

                {/* My Notes Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">My Notes</h3>
                    {!isEditing && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setEditTitle(note.title);
                            setEditDescription(note.description || "");
                            setEditContent(note.content || "");
                            setEditTags(note.tags.map((t) => t.title));
                            setIsEditing(true);
                          }}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            setEditorTarget("content");
                            setIsEditorOpen(true);
                          }}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <Maximize2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-32 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add notes..."
                    />
                  ) : contentLines.length > 0 ? (
                    <div className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
                      {contentLines.map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[14px] text-gray-500 dark:text-gray-500 italic">
                      No notes added yet. Click edit to add some!
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-6">
                {/* Details Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                  <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-5">Details</h3>
                  <dl className="space-y-4">
                    <div className="grid grid-cols-[100px_1fr] text-[13px] items-center">
                      <dt className="text-gray-500 dark:text-gray-400">Source</dt>
                      <dd className="text-gray-900 dark:text-gray-100 font-medium">
                        {getSourceLabel(note.sourceType)}
                      </dd>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] text-[13px] items-center">
                      <dt className="text-gray-500 dark:text-gray-400">Added by</dt>
                      <dd className="text-gray-900 dark:text-gray-100 font-medium">You</dd>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] text-[13px] items-center">
                      <dt className="text-gray-500 dark:text-gray-400">Type</dt>
                      <dd className="text-gray-900 dark:text-gray-100 font-medium capitalize">
                        {note.sourceType.toLowerCase().replace("_", " ")}
                      </dd>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] text-[13px] items-center">
                      <dt className="text-gray-500 dark:text-gray-400">Visibility</dt>
                      <dd className="flex items-center gap-2">
                        <ToggleSwitch
                          id="visibility-toggle"
                          checked={note.isPublic}
                          onChange={async () => { await handleToggleVisibility(); }}
                          disabled={isUpdating}
                        />
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {note.isPublic ? "Public" : "Private"}
                        </span>
                      </dd>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] text-[13px] items-center">
                      <dt className="text-gray-500 dark:text-gray-400">Size</dt>
                      <dd className="text-gray-900 dark:text-gray-100 font-medium">-</dd>
                    </div>
                  </dl>
                </div>

                {/* Tags Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                  <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {isEditing ? (
                      <>
                        {editTags.map((tag) => (
                          <div key={tag} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full text-[13px] font-medium text-gray-700 dark:text-gray-300">
                            {tag}
                            <button type="button" onClick={() => setEditTags(editTags.filter(t => t !== tag))} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        <TagAutocompleteInput editTags={editTags} setEditTags={setEditTags} />
                      </>
                    ) : (
                      note.tags.map((tag) => (
                        <Tag key={tag.id} label={tag.title} colored />
                      ))
                    )}
                  </div>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsTagManagerOpen(true)}
                      className="flex items-center gap-1.5 text-[13px] text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                      <Plus size={14} /> Add Tag
                    </button>
                  )}
                </div>

                {/* Links Card */}
                {note.link && (
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">Links</h3>
                    <div className="mb-1">
                      <span className="text-[13px] text-blue-600 dark:text-blue-400 font-medium">
                        Original Link
                      </span>
                    </div>
                    <a
                      href={note.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between text-[13px] text-blue-500 dark:text-blue-400 hover:underline"
                    >
                      <span className="truncate pr-2">{note.link}</span>
                      <ExternalLink size={14} className="shrink-0 text-blue-500 dark:text-blue-400" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="w-full">
              {isEditing ? (
                <div className="w-full max-w-3xl mx-auto text-left py-6">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-64 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] text-gray-900 dark:text-gray-100 shadow-sm"
                    placeholder="Write your notes here..."
                  />
                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
                    >
                      {isUpdating ? "Saving..." : "Save Notes"}
                    </button>
                  </div>
                </div>
              ) : note.content ? (
                <div className="w-full max-w-3xl mx-auto py-6">
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditTitle(note.title);
                        setEditDescription(note.description || "");
                        setEditContent(note.content || "");
                        setEditTags(note.tags.map((t) => t.title));
                        setIsEditing(true);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      <Edit3 size={14} /> Edit Notes
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="whitespace-pre-wrap text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed">
                      {note.content}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-12 text-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                    <Edit3 size={20} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">No notes yet. Click below to add some.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditTitle(note.title);
                      setEditDescription(note.description || "");
                      setEditContent(note.content || "");
                      setEditTags(note.tags.map((t) => t.title));
                      setIsEditing(true);
                    }}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 text-sm font-medium"
                  >
                    Add Notes
                  </button>
                </div>
              )}
            </div>
          )}

          {(activeTab === "transcript" || activeTab === "comments") && (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                <FileText size={20} className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{activeTab} not available</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Expanded Editor Modal */}
      {isEditorOpen && editorTarget && (
        <NoteEditor
          editorType={editorTarget}
          initialTitle={note.title}
          initialContent={editorTarget === "content" ? (note.content || "") : (note.description || "")}
          onSave={async (title, content) => {
            await updateContent({
              id: note.id,
              data: {
                title,
                ...(editorTarget === "content" ? { content } : { description: content })
              }
            });
          }}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      {/* Move-to-trash confirmation dialog */}
      {showDeleteDialog && (
        <ConfirmDeleteDialog
          title="Move to Trash?"
          description={
            <>
              <span className="font-medium text-gray-700 dark:text-gray-300 line-clamp-2">
                &ldquo;{note.title}&rdquo;
              </span>{" "}
              will be moved to Trash. You can restore it later or delete it permanently from there.
            </>
          }
          confirmLabel="Move to Trash"
          isConfirming={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}

      <TagManagerDialog
        open={isTagManagerOpen}
        onClose={() => setIsTagManagerOpen(false)}
        noteId={note.id}
        noteTags={note.tags.map((t) => t.title)}
        onSaveNoteTags={async (tags) => {
          await updateContent({
            id: note.id,
            data: { tags },
          });
        }}
      />
    </div>
  );
}
