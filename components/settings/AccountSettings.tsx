"use client";

import { useRouter } from "next/navigation";
import * as Avatar from "@radix-ui/react-avatar";
import { LogOut } from "lucide-react";

interface AccountSettingsProps {
  username: string;
}

export function AccountSettings({ username }: AccountSettingsProps) {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("sb_token");
    localStorage.removeItem("sb_username");
    router.push("/signin");
  }

  const initials = username
    .split(/[\s_-]/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("") || "SB";

  return (
    <div className="space-y-8">
      <h2 className="text-base font-semibold text-gray-900">Account</h2>

      {/* Profile */}
      <section aria-labelledby="profile-heading">
        <h3 id="profile-heading" className="text-sm font-semibold text-gray-700 mb-4">
          Profile
        </h3>

        {/* Avatar */}
        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50 mb-4">
          <Avatar.Root className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-blue-600 shrink-0">
            <Avatar.Fallback className="text-white text-xl font-semibold">
              {initials}
            </Avatar.Fallback>
          </Avatar.Root>
          <div>
            <p className="text-sm font-medium text-gray-900">Profile Image</p>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG up to 2MB</p>
          </div>
          <button
            type="button"
            className="ml-auto px-4 py-1.5 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Change
          </button>
        </div>

        {/* Username */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="text-gray-400 text-xs">👤</span>
            <span className="text-gray-900">{username}</span>
          </div>
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Edit
          </button>
        </div>

        {/* Email placeholder */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="text-gray-400 text-xs">✉️</span>
            <span className="text-gray-500">No email linked</span>
          </div>
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Edit
          </button>
        </div>

        {/* Logout */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      </section>

      {/* Account Details */}
      <section aria-labelledby="account-details-heading">
        <h3 id="account-details-heading" className="text-sm font-semibold text-gray-700 mb-4">
          Account Details
        </h3>

        <div className="space-y-0">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-400">Second Brain ID</p>
              <p className="text-sm text-gray-700 mt-0.5">—</p>
            </div>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Edit
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-400">Password</p>
              <p className="text-sm text-gray-700 mt-0.5">••••••••••••</p>
            </div>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Change
            </button>
          </div>
        </div>
      </section>

      {/* Subscription */}
      <section aria-labelledby="subscription-heading">
        <h3 id="subscription-heading" className="text-sm font-semibold text-gray-700 mb-4">
          Subscription
        </h3>

        <div className="flex items-center justify-between p-4 border border-amber-200 bg-amber-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-amber-600 text-sm">⚡</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Account Status</p>
              <p className="text-xs text-gray-500">Basic Plan</p>
            </div>
          </div>
          <button
            type="button"
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Go Gold
          </button>
        </div>
      </section>
    </div>
  );
}
