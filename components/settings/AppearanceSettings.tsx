"use client";

import { useState, useEffect } from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import type { ThemeMode, SidebarDensity, FontSize } from "@/lib/types";
import { ToggleSwitch } from "@/components/common/ToggleSwitch";
import { RadioTileGroup } from "./RadioTileGroup";
import { Type, AlignLeft, AlignJustify, Maximize } from "lucide-react";

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
        <div className="flex flex-col gap-3">
          <div>
            <h3 id="theme-heading" className="text-sm font-medium text-gray-900">
              Theme
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Choose your preferred theme
            </p>
          </div>
          <div className="mt-2 flex justify-start">
            <RadioTileGroup
              name="theme"
              value={mounted ? theme || "system" : "system"}
              onChange={(v) => setTheme(v as ThemeMode)}
              options={[
                { value: "light", icon: <Sun />, label: "Light" },
                { value: "dark", icon: <Moon />, label: "Dark" },
                { value: "system", icon: <Monitor />, label: "System" },
              ]}
              className="!justify-start gap-3"
            />
          </div>
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
          <ToggleSwitch
            checked={use24Hour}
            onChange={setUse24Hour}
          />
        </div>
      </section>

      {/* Sidebar Density */}
      <section aria-labelledby="density-heading" className="border-t border-gray-100 pt-5">
        <div className="flex flex-col gap-3">
          <div>
            <h3 id="density-heading" className="text-sm font-medium text-gray-900">
              Sidebar Density
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Choose how comfortable the sidebar looks
            </p>
          </div>
          <div className="mt-2 flex justify-start">
            <RadioTileGroup
              name="density"
              value={density}
              onChange={(v) => setDensity(v as SidebarDensity)}
              options={[
                { value: "compact", icon: <AlignLeft />, label: "Compact" },
                { value: "comfortable", icon: <AlignJustify />, label: "Comfort" },
                { value: "spacious", icon: <Maximize />, label: "Spacious" },
              ]}
              className="!justify-start gap-3"
            />
          </div>
        </div>
      </section>

      {/* Font Size */}
      <section aria-labelledby="font-size-heading" className="border-t border-gray-100 pt-5">
        <div className="flex flex-col gap-3">
          <div>
            <h3 id="font-size-heading" className="text-sm font-medium text-gray-900">
              Font Size
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Adjust the size of text across the app
            </p>
          </div>
          <div className="mt-2 flex justify-start">
            <RadioTileGroup
              name="fontSize"
              value={fontSize}
              onChange={(v) => setFontSize(v as FontSize)}
              options={[
                { value: "small", icon: <Type size={16} />, label: "Small" },
                { value: "medium", icon: <Type size={20} />, label: "Medium" },
                { value: "large", icon: <Type size={24} />, label: "Large" },
              ]}
              className="!justify-start gap-3"
            />
          </div>
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
          <ToggleSwitch
            checked={reduceMotion}
            onChange={setReduceMotion}
          />
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
          <ToggleSwitch
            checked={coloredTags}
            onChange={setColoredTags}
          />
        </div>
      </section>
    </div>
  );
}
