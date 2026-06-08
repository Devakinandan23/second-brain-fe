"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function ToggleSwitch({ checked, onChange, disabled, className, id }: ToggleSwitchProps) {
  return (
    <label className={cn("custom-switch", className)} htmlFor={id}>
      <input 
        id={id}
        type="checkbox" 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="custom-slider"></span>
    </label>
  );
}
