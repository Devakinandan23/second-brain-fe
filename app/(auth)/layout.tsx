import { Logo } from "@/components/common/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-gray-950 py-8 transition-colors">
      <div className="w-full max-w-sm px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shrink-0 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-800">
            <Logo className="w-5 h-5" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white text-lg tracking-tight">
            Second Brain
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
