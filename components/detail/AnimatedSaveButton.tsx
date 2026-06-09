"use client";

import { Save } from "lucide-react";
import styles from "./AnimatedSaveButton.module.css";
import { cn } from "@/lib/utils";

interface AnimatedSaveButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  isSaving?: boolean;
}

export function AnimatedSaveButton({ onClick, disabled, className, isSaving }: AnimatedSaveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isSaving}
      className={cn(styles.animatedButton, className, (disabled || isSaving) && "opacity-50 cursor-not-allowed")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={styles.arr2}
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
      </svg>
      <span className={styles.text}>{isSaving ? "Saving..." : "Save"}</span>
      <span className={styles.circle}></span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={styles.arr1}
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
      </svg>
    </button>
  );
}
