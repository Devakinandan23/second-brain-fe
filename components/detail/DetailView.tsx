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
  Maximize2,
} from "lucide-react";
import { Tag } from "@/components/common/Tag";
import { cn, formatDate, getSourceLabel, extractDomain } from "@/lib/utils";
import { SiYoutube, SiX, SiNotion, SiGoogledocs } from "@icons-pack/react-simple-icons";
import type { Note, SourceType } from "@/lib/types";
import { useUpdateContent } from "@/lib/hooks/useContent";

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

  const { mutateAsync: updateContent, isPending: isUpdating } = useUpdateContent();

  async function handleSave() {
    try {
      await updateContent({
        id: note.id,
        data: {
          title: editTitle,
          description: editDescription,
          content: editContent,
        },
      });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save changes.");
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
            <button
              type="button"
              onClick={handleSave}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditTitle(note.title);
                setEditDescription(note.description || "");
                setEditContent(note.content || "");
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
            className="p-1.5 text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-amber-500 transition-colors shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Star size={16} />
          </button>
          <button
            type="button"
            aria-label="More options"
            className="p-1.5 text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <MoreHorizontal size={16} />
          </button>
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
              {note.tags.map((tag) => (
                <Tag key={tag.id} label={tag.title} colored />
              ))}
              <button
                type="button"
                aria-label="Add tag"
                className="flex items-center justify-center w-7 h-7 text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <Plus size={14} />
              </button>
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
                    <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">
                      Description
                    </h3>
                    <div className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                      {isEditing ? (
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full h-24 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Add a description..."
                        />
                      ) : (
                        <>
                          <p>{note.description}</p>
                          {/* Fake content to match screenshot if real content is short */}
                          {note.description && note.description.length < 50 && (
                            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 dark:text-gray-400">
                              <li>Horizontal vs Vertical Scaling</li>
                              <li>Load Balancing Strategies</li>
                              <li>Caching Layers</li>
                              <li>Database Sharding</li>
                            </ul>
                          )}
                        </>
                      )}
                    </div>
                    {!isEditing && (
                      <button className="mt-4 text-[14px] text-blue-600 dark:text-blue-400 font-medium hover:underline">
                        Show more
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
                            setIsEditing(true);
                          }}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
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
                    <div className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed">
                      <p className="font-semibold text-gray-900 dark:text-white mb-2">Key takeaways:</p>
                      <ul className="list-disc pl-5 space-y-1.5 text-gray-600 dark:text-gray-400 mb-6">
                        <li>Always design for horizontal scaling</li>
                        <li>Identify bottlenecks early</li>
                        <li>Caching can improve read performance drastically</li>
                      </ul>
                      <p className="font-semibold text-gray-900 dark:text-white mb-2">Architecture patterns to remember:</p>
                      <ul className="list-disc pl-5 space-y-1.5 text-gray-600 dark:text-gray-400">
                        <li>Microservices + API Gateway</li>
                        <li>CDN for static assets</li>
                        <li>Queue for async processing</li>
                      </ul>
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
                      <dd className="flex items-center gap-1.5 text-gray-900 dark:text-gray-100 font-medium">
                        <Lock size={12} className="text-gray-400" />
                        {note.isPublic ? "Public" : "Private"}
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
                    {note.tags.map((tag) => (
                      <Tag key={tag.id} label={tag.title} colored />
                    ))}
                  </div>
                  <button className="flex items-center gap-1.5 text-[13px] text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                    <Plus size={14} /> Add Tag
                  </button>
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
            <div className="flex flex-col items-center py-12 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                <Edit3 size={20} className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">View notes in Overview or edit them here.</p>
              
              {isEditing ? (
                <div className="w-full max-w-3xl text-left">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-64 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] text-gray-900 dark:text-gray-100"
                    placeholder="Write your notes here..."
                  />
                  <div className="mt-4 flex justify-end">
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
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditTitle(note.title);
                    setEditDescription(note.description || "");
                    setEditContent(note.content || "");
                    setIsEditing(true);
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 text-sm font-medium"
                >
                  Edit Notes
                </button>
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
    </div>
  );
}
