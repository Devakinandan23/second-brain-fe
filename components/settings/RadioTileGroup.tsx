"use client";

import { useId } from "react";
import styles from "./RadioTileGroup.module.css";
import { cn } from "@/lib/utils";

interface RadioOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface RadioTileGroupProps {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  className?: string;
  tileClassName?: string;
}

export function RadioTileGroup({
  name,
  value,
  onChange,
  options,
  className,
  tileClassName,
}: RadioTileGroupProps) {
  const defaultName = useId();
  const groupName = name || defaultName;

  return (
    <div className={cn(styles.radioInputs, className)}>
      {options.map((option) => {
        const inputId = `${groupName}-${option.value}`;
        return (
          <label key={option.value} htmlFor={inputId}>
            <input
              className={styles.radioInput}
              type="radio"
              name={groupName}
              id={inputId}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className={cn(styles.radioTile, tileClassName)}>
              {option.icon && (
                <span className={styles.radioIcon}>{option.icon}</span>
              )}
              <span className={styles.radioLabel}>{option.label}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
