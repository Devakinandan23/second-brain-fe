import { getPublicContent } from "@/lib/api";
import { notFound } from "next/navigation";
import { formatDate, getSourceLabel } from "@/lib/utils";
import { getTagColor } from "@/components/common/Tag";
import type { Tag } from "@/lib/types";
import { SiYoutube, SiX, SiNotion, SiGoogledocs } from "@icons-pack/react-simple-icons";
import { Globe, FileText, ExternalLink, Brain } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const note = await getPublicContent(resolvedParams.id);
    if (!note || !note.isPublic) return {};
    return {
      title: `${note.title} | Second Brain`,
      description: note.description || "Shared from Second Brain",
    };
  } catch (err) {
    return {};
  }
}

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  YOUTUBE: <SiYoutube size={20} className="text-[#FF0000]" />,
  TWITTER: <SiX size={20} className="text-black dark:text-white" />,
  NOTION: <SiNotion size={20} className="text-black dark:text-white" />,
  GOOGLE_DOC: <SiGoogledocs size={20} className="text-[#4285F4]" />,
  WEBSITE: <Globe size={20} className="text-violet-500" />,
  INTERNAL: <FileText size={20} className="text-amber-500" />,
};

export default async function PublicNotePage({ params }: PageProps) {
  let note;
  try {
    const resolvedParams = await params;
    note = await getPublicContent(resolvedParams.id);
    
    if (!note || !note.isPublic) {
      notFound();
    }
  } catch (err) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900/30 dark:selection:text-blue-100">
      
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Brain size={18} />
          <span className="text-[13px] font-medium tracking-wide uppercase">Shared from Second Brain</span>
        </div>
        <Link 
          href="/" 
          className="text-[13px] font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
        >
          Build your own
        </Link>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 md:py-20">
        <article className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/40 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 overflow-hidden">
          
          {/* Thumbnail Hero */}
          {note.thumbnail && (
            <div className="w-full aspect-[21/9] sm:aspect-[2.5/1] bg-gray-100 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={note.thumbnail}
                alt={note.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* Meta Top */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center shrink-0">
                {SOURCE_ICONS[note.sourceType]}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-gray-900 dark:text-gray-100">
                  {getSourceLabel(note.sourceType)}
                </p>
                <p className="text-[12px] text-gray-500 dark:text-gray-400">
                  {formatDate(note.createdAt)}
                </p>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 tracking-tight">
              {note.title}
            </h1>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {note.tags.map((tag: Tag) => {
                  const { bg, text } = getTagColor(tag.title);
                  return (
                    <span
                      key={tag.id}
                      className={`px-2.5 py-1 rounded-md text-[13px] font-medium ${bg} ${text}`}
                    >
                      {tag.title}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Description / Content */}
            {(note.description || note.content) && (
              <div className="prose prose-gray dark:prose-invert max-w-none text-[16px] leading-relaxed mb-10">
                {note.description && (
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium mb-6">
                    {note.description}
                  </p>
                )}
                {note.content && (
                  <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                    {note.content}
                  </div>
                )}
              </div>
            )}

            {/* Original Link Footer */}
            {note.link && (
              <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                <a
                  href={note.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[14px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                >
                  <ExternalLink size={16} />
                  View Original Source
                </a>
              </div>
            )}
          </div>
        </article>
      </main>
      
      {/* ── Footer ── */}
      <footer className="py-8 text-center text-[13px] text-gray-400 dark:text-gray-600">
        Powered by Second Brain &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
