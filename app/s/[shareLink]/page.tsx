import { getSharedBrain } from "@/lib/api";
import { notFound } from "next/navigation";
import { Brain, ExternalLink, FileText, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ shareLink: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const data = await getSharedBrain(resolvedParams.shareLink);
    if (!data) return {};
    return {
      title: `${data.username}'s Second Brain`,
      description: `Explore ${data.username}'s shared knowledge and public notes.`,
    };
  } catch (err) {
    return {};
  }
}

export default async function SharedBrainPage({ params }: PageProps) {
  let data;
  try {
    const resolvedParams = await params;
    data = await getSharedBrain(resolvedParams.shareLink);
    
    if (!data) {
      notFound();
    }
  } catch (err) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900/30 dark:selection:text-blue-100">
      
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Brain size={18} />
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
              {data.username}&apos;s Second Brain
            </h1>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">
              Public Collection
            </p>
          </div>
        </div>
        <Link 
          href="/" 
          className="text-[13px] font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
        >
          Build your own
        </Link>
      </header>

      {/* ── Main Content ── */}
      <main className="w-full max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
            Explore {data.username}&apos;s Knowledge Base
          </h2>
          <p className="text-[15px] text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            A curated collection of public notes, articles, and insights shared openly.
          </p>
        </div>

        {data.content.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-gray-400" />
            </div>
            <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-2">
              No public notes yet
            </h3>
            <p className="text-[14px] text-gray-500 dark:text-gray-400">
              {data.username} hasn&apos;t shared any content publicly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.content.map((note, idx) => (
              <div 
                key={idx}
                className="group flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg transition-all duration-200"
              >
                {/* Thumbnail Area */}
                <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800 overflow-hidden flex items-center justify-center">
                  {note.thumbnail ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={note.thumbnail}
                      alt={note.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <ImageIcon size={32} className="text-gray-300 dark:text-gray-700" />
                  )}
                  {note.link && (
                    <a
                      href={note.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                      aria-label="Open source link"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-[16px] font-bold text-gray-900 dark:text-white leading-tight mb-2 line-clamp-2">
                    {note.title}
                  </h3>
                  
                  {note.description ? (
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
                      {note.description}
                    </p>
                  ) : note.content ? (
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
                      {note.content}
                    </p>
                  ) : (
                    <div className="flex-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="py-8 text-center text-[13px] text-gray-400 dark:text-gray-600">
        Powered by Second Brain &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
