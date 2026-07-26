export type SourceType =
  | "YOUTUBE"
  | "TWITTER"
  | "NOTION"
  | "GOOGLE_DOC"
  | "WEBSITE"
  | "INTERNAL";

export interface Tag {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  sourceType: SourceType;
  title: string;
  extractedTitle?: string | null;
  link?: string | null;
  tags: Tag[];
  content?: string | null;
  description?: string | null;
  thumbnail?: string | null;
  authorName?: string | null;
  metadata?: Record<string, unknown> | null;
  isPublic: boolean;
  isFavorite: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  email?: string | null;
}

export interface ShareLink {
  isActive: boolean;
  link: string | null;
}

// API Request/Response types
export interface SigninRequest {
  username: string;
  password: string;
}

export interface SigninResponse {
  token: string;
  username: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  passwordHint?: string;
}

export interface SignupResponse {
  message: string;
}

export interface CurrentUserResponse {
  user: User;
}

export interface GetContentResponse {
  content: Note[];
}

export interface GetTrashResponse {
  content: Note[];
}

export interface CreateContentRequest {
  // Backend contentSchema: link is required z.url()
  link: string;
  // Backend contentSchema: title is required z.string()
  title: string;
  // Backend contentSchema: content is z.string().nullable() — required, must be null not undefined
  content: string | null;
  // Backend contentSchema: authorName is z.string().nullable() — required, must be null not undefined
  authorName: string | null;
  // Backend contentSchema: tags z.array(...)
  tags: string[];
}

export interface CreateContentResponse {
  message: string;
  content: Note;
}

export interface UpdateContentRequest {
  title?: string;
  extractedTitle?: string;
  content?: string;
  description?: string;
  link?: string;
  thumbnail?: string;
  authorName?: string;
  metadata?: Record<string, unknown>;
  isPublic?: boolean;
  isFavorite?: boolean;
  tags?: string[];
}

export interface DeleteContentRequest {
  id: string;
}

export interface ShareLinkRequest {
  share: boolean;
}

export interface SharedBrainResponse {
  username: string;
  content: Pick<Note, "title" | "link" | "content" | "description" | "thumbnail">[];
}

// UI State types
export type ViewMode = "list" | "grid" | "calendar";
export type SidebarSection =
  | "inbox"
  | "today"
  | "all"
  | "favorites"
  | "trash"
  | "notes"
  | "articles"
  | "videos"
  | "tweets"
  | "documents";

export type ThemeMode = "light" | "dark" | "system";
export type SidebarDensity = "compact" | "comfortable" | "spacious";
export type FontSize = "small" | "medium" | "large";

export interface AppearanceSettings {
  theme: ThemeMode;
  use24HourTime: boolean;
  sidebarDensity: SidebarDensity;
  fontSize: FontSize;
  reduceMotion: boolean;
  coloredTags: boolean;
}
