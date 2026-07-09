export interface TagEntry {
  title: string;
  count: number;
}

export interface TagManagerDialogProps {
  open: boolean;
  onClose: () => void;
  /** If provided, manages tags for a specific note */
  noteId?: string;
  noteTags?: string[];
  onSaveNoteTags?: (tags: string[]) => Promise<void>;
  onApplyFilter?: (tags: string[]) => void;
  initialFilterTags?: string[];
}

export type TagManagerTab = "all" | "note";
