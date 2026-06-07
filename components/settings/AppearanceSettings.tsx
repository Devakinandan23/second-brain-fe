"use client";

import { useState, useEffect } from "react";
import * as Switch from "@radix-ui/react-switch";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import type { ThemeMode, SidebarDensity, FontSize } from "@/lib/types";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [use24Hour, setUse24Hour] = useState(true);
  const [density, setDensity] = useState<SidebarDensity>("comfortable");
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [coloredTags, setColoredTags] = useState(true);

  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-7">
      <h2 className="text-base font-semibold text-gray-900">Appearance</h2>

      {/* Theme */}
      <section aria-labelledby="theme-heading">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 id="theme-heading" className="text-sm font-medium text-gray-900">
              Theme
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Choose your preferred theme
            </p>
          </div>
          <ToggleGroup.Root
            type="single"
            value={mounted ? theme : "system"}
            onValueChange={(v) => v && setTheme(v as ThemeMode)}
            className="flex gap-0.5 bg-gray-100 p-0.5 rounded-xl shrink-0"
            aria-label="Theme selection"
          >
            {[
              { value: "light", icon: <Sun size={14} />, label: "Light" },
              { value: "dark", icon: <Moon size={14} />, label: "Dark" },
              { value: "system", icon: <Monitor size={14} />, label: "System" },
            ].map(({ value, icon, label }) => (
              <ToggleGroup.Item
                key={value}
                value={value}
                aria-label={`${label} theme`}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 min-w-[56px]",
                  theme === value
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                )}
              >
                {icon}
                {label}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </div>
      </section>

      {/* 24-hour time */}
      <section aria-labelledby="time-format-heading" className="border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 id="time-format-heading" className="text-sm font-medium text-gray-900">
              Use 24-Hour Time
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Display times in 24-hour format
            </p>
          </div>
          <Switch.Root
            checked={use24Hour}
            onCheckedChange={setUse24Hour}
            aria-labelledby="time-format-heading"
            className={cn(
              "relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              use24Hour ? "bg-blue-600" : "bg-gray-200"
            )}
          >
            <Switch.Thumb className="block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-5.5" />
          </Switch.Root>
        </div>
      </section>

      {/* Sidebar Density */}
      <section aria-labelledby="density-heading" className="border-t border-gray-100 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 id="density-heading" className="text-sm font-medium text-gray-900">
              Sidebar Density
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Choose how comfortable the sidebar looks
            </p>
          </div>
          <ToggleGroup.Root
          type="single"
          value={density}
          onValueChange={(v) => v && setDensity(v as SidebarDensity)}
          className="flex gap-1"
          aria-labelledby="density-heading"
        >
          {(["compact", "comfortable", "spacious"] as SidebarDensity[]).map((d) => (
            <ToggleGroup.Item
              key={d}
              value={d}
              className={cn(
                "flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all duration-150 capitalize",
                density === d
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              )}
            >
              {d}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
        </div>
      </section>

      {/* Font Size */}
      <section aria-labelledby="font-size-heading" className="border-t border-gray-100 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 id="font-size-heading" className="text-sm font-medium text-gray-900">
              Font Size
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Adjust the size of text across the app
            </p>
          </div>
          <ToggleGroup.Root
          type="single"
          value={fontSize}
          onValueChange={(v) => v && setFontSize(v as FontSize)}
          className="flex gap-1"
          aria-labelledby="font-size-heading"
        >
          {(["small", "medium", "large"] as FontSize[]).map((f) => (
            <ToggleGroup.Item
              key={f}
              value={f}
              className={cn(
                "flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all duration-150 capitalize",
                fontSize === f
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              )}
            >
              {f}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
        </div>
      </section>

      {/* Reduce Motion */}
      <section aria-labelledby="motion-heading" className="border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 id="motion-heading" className="text-sm font-medium text-gray-900">
              Reduce Motion
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Minimize animations throughout the app
            </p>
          </div>
          <Switch.Root
            checked={reduceMotion}
            onCheckedChange={setReduceMotion}
            aria-labelledby="motion-heading"
            className={cn(
              "relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              reduceMotion ? "bg-blue-600" : "bg-gray-200"
            )}
          >
            <Switch.Thumb className="block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-5.5" />
          </Switch.Root>
        </div>
      </section>

      {/* Colored Tags */}
      <section aria-labelledby="colored-tags-heading" className="border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 id="colored-tags-heading" className="text-sm font-medium text-gray-900">
              Colored Tags
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Show colors on tags</p>
          </div>
          <Switch.Root
            checked={coloredTags}
            onCheckedChange={setColoredTags}
            aria-labelledby="colored-tags-heading"
            className={cn(
              "relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              coloredTags ? "bg-blue-600" : "bg-gray-200"
            )}
          >
            <Switch.Thumb className="block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-5.5" />
          </Switch.Root>
        </div>
      </section>
    </div>
  );
}
