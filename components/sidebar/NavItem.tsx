"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SidebarSection } from "@/lib/types";

interface NavItemProps {
  href?: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive?: boolean;
  section?: SidebarSection;
  onClick?: () => void;
}

export function NavItem({
  href,
  icon,
  label,
  count,
  isActive,
  onClick,
}: NavItemProps) {
  const classes = cn(
    "group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-colors duration-150 w-full text-left cursor-pointer",
    isActive
      ? "bg-blue-50 text-blue-700 font-medium"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
  );

  const content = (
    <>
      <span
        className={cn(
          "shrink-0 transition-colors",
          isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
        )}
      >
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "text-xs font-medium tabular-nums",
            isActive ? "text-blue-500" : "text-gray-400"
          )}
        >
          {count}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
