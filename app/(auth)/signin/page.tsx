"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, KeyRound, Loader2, User } from "lucide-react";
import { signin } from "@/lib/api";
import axios from "axios";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

const oauthErrors: Record<string, string> = {
  oauth_not_configured: "Google sign-in is not configured on the server yet.",
  oauth_failed: "Google sign-in could not be completed. Please try again.",
  account_link_required:
    "A different account already uses this email. Automatic linking is disabled for security.",
};

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const oauthError = new URLSearchParams(window.location.search).get("error");
    if (!oauthError) return;

    const timer = window.setTimeout(() => {
      setError(oauthErrors[oauthError] ?? "Google sign-in could not be completed.");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const data = await signin({ username, password });
      localStorage.setItem("sb_username", data.username);
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          // Backend is down or network issue
          setError("Unable to connect to server. Please try again later.");
        } else {
          // Backend returned a specific error
          const msg = err.response.data?.message || "Invalid username or password.";
          
          // Make the backend messages more user-friendly
          if (msg === "username not found") {
            setError("Username not found.");
          } else if (msg === "Incorrect password") {
            if (err.response.data?.hint) {
              setError(`Incorrect password. Hint: ${err.response.data.hint}`);
            } else {
              setError("Incorrect password.");
            }
          } else {
            if (err.response.data?.hint) {
              setError(`${msg} (Hint: ${err.response.data.hint})`);
            } else {
              setError(msg);
            }
          }
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm px-7 py-8 transition-colors sm:px-9">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-500">
          Sign in
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Continue to your Second Brain
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="username"
            className="block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400 mb-2"
          >
            Username
          </label>
          <div className="auth-field group flex min-h-12 items-center rounded-lg border border-gray-200 bg-white text-gray-900 transition-colors duration-150 focus-within:border-gray-300 focus-within:ring-0 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus-within:border-gray-600">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center border-r border-gray-200 text-gray-400 transition-colors group-focus-within:text-blue-600 dark:border-gray-700 dark:text-gray-500 dark:group-focus-within:text-blue-500">
              <User size={17} strokeWidth={2} aria-hidden="true" />
            </span>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="auth-field-input h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-gray-900 placeholder-gray-400 outline-none dark:text-white dark:placeholder-gray-500"
              placeholder="your-username"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400 mb-2"
          >
            Password
          </label>
          <div className={`auth-field group relative flex min-h-12 items-center overflow-hidden rounded-lg border border-gray-200 transition-colors duration-300 focus-within:border-gray-300 focus-within:ring-0 dark:border-gray-700 dark:focus-within:border-gray-600 ${showPassword ? "bg-white text-gray-900 dark:bg-white dark:text-gray-900" : "bg-gray-900 text-white dark:bg-black"}`}>
            <span className={`pointer-events-none absolute right-2 top-1/2 z-0 h-10 w-10 -translate-y-1/2 rounded-full bg-white transition-transform duration-500 ease-out ${showPassword ? "scale-[20]" : "scale-100"}`} aria-hidden="true" />
            <span className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center border-r transition-colors duration-300 ${showPassword ? "border-gray-200 text-gray-400 dark:border-gray-200 dark:text-gray-400" : "border-gray-700 text-gray-300 dark:border-gray-800 dark:text-gray-400"}`}>
              <KeyRound size={17} strokeWidth={2} aria-hidden="true" />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`auth-field-input relative z-10 h-12 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none transition-colors duration-300 ${showPassword ? "text-gray-900 placeholder-gray-400 dark:text-gray-900 dark:placeholder-gray-400" : "text-white placeholder-gray-500 dark:text-gray-100 dark:placeholder-gray-600"}`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className={`auth-field-toggle relative z-10 mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-0 ${showPassword ? "text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-700" : "text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400"}`}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye size={18} strokeWidth={2} aria-hidden="true" />
              ) : (
                <EyeOff size={18} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight size={16} aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      <GoogleSignInButton />

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-7">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
