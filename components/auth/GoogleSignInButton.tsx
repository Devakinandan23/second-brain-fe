"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

function apiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  return `${window.location.protocol}//${window.location.hostname}:3001`;
}

export function GoogleSignInButton() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  function handleGoogleSignIn() {
    setIsRedirecting(true);
    window.location.assign(`${apiBaseUrl()}/api/v1/auth/google`);
  }

  return (
    <>
      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
          or
        </span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isRedirecting}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
      >
        {isRedirecting ? (
          <Loader2 size={17} className="animate-spin" aria-hidden="true" />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-5 w-5 items-center justify-center rounded-full font-bold text-blue-600"
          >
            G
          </span>
        )}
        {isRedirecting ? "Opening Google..." : "Continue with Google"}
      </button>
    </>
  );
}
