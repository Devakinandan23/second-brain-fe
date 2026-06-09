"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";

export function SessionHandler() {
  const [isExpired, setIsExpired] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleSessionExpired = () => {
      // Don't show if we are already on signup or signin
      if (pathname === "/signup" || pathname === "/signin") return;
      
      setIsExpired(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/signin");
        setIsExpired(false);
      }, 2500);
    };

    window.addEventListener("session_expired", handleSessionExpired);
    return () => window.removeEventListener("session_expired", handleSessionExpired);
  }, [router, pathname]);

  if (!isExpired) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white/90 dark:bg-gray-950/90 backdrop-blur-md flex justify-center items-center p-4 animate-in fade-in duration-200">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/30 shadow-2xl rounded-2xl p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert size={32} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Session Expired
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Your security token has expired or is invalid. Please sign in again to continue.
        </p>
        <div className="flex items-center gap-3 text-sm font-medium text-blue-600 dark:text-blue-400">
          <Loader2 size={16} className="animate-spin" /> Redirecting to Signin...
        </div>
      </div>
    </div>
  );
}
