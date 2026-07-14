import axios from "axios";
import type {
  SigninRequest,
  SigninResponse,
  SignupRequest,
  SignupResponse,
  GetContentResponse,
  CreateContentRequest,
  CreateContentResponse,
  UpdateContentRequest,
  ShareLinkRequest,
  ShareLink,
  SharedBrainResponse,
  GetTrashResponse,
  Note,
} from "./types";
import { normalizeNoteTitle } from "./utils";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.6:3001";

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Inject auth token on every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("sb_token");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return config;
});

// Handle auth expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("sb_token");
        window.dispatchEvent(new Event("session_expired"));
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export async function signin(data: SigninRequest): Promise<SigninResponse> {
  const res = await apiClient.post<SigninResponse>("/signin", data);
  return res.data;
}

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  const res = await apiClient.post<SignupResponse>("/signup", data);
  return res.data;
}

// Content / Notes
export async function getContent(): Promise<GetContentResponse> {
  const res = await apiClient.get<GetContentResponse>(`/content?t=${Date.now()}`);
  return {
    ...res.data,
    content: res.data.content.map((note) => ({
      ...note,
      title: normalizeNoteTitle(note.title),
    })),
  };
}

export async function getPublicContent(id: string): Promise<Note> {
  const res = await apiClient.get<Note>(`/content/public/${id}`);
  return { ...res.data, title: normalizeNoteTitle(res.data.title) };
}

export async function createContent(
  data: CreateContentRequest
): Promise<CreateContentResponse> {
  const res = await apiClient.post<CreateContentResponse>("/content", data);
  return res.data;
}

export interface ImportContentResponse {
  imported: number;
  skipped: number;
  failed: number;
}

export async function importContent(
  data: Record<string, unknown>
): Promise<ImportContentResponse> {
  const res = await apiClient.post<ImportContentResponse>("/content/import", data);
  return res.data;
}

export async function updateContent(
  id: string,
  data: UpdateContentRequest
): Promise<{ message: string }> {
  const res = await apiClient.patch<{ message: string }>(
    `/content/${id}`,
    data
  );
  return res.data;
}

export async function deleteContent(
  id: string
): Promise<{ message: string }> {
  const res = await apiClient.delete<{ message: string }>(`/content/${id}`);
  return res.data;
}

// Share Link
export async function toggleShareLink(
  data: ShareLinkRequest
): Promise<ShareLink> {
  const res = await apiClient.post<ShareLink>("/brain/share", data);
  return res.data;
}

export async function getSharedBrain(
  shareLink: string
): Promise<SharedBrainResponse> {
  const res = await apiClient.get<SharedBrainResponse>(
    `/brain/${shareLink}`
  );
  return {
    ...res.data,
    content: res.data.content.map((note) => ({
      ...note,
      title: normalizeNoteTitle(note.title),
    })),
  };
}

// Trash
export async function getTrash(): Promise<GetTrashResponse> {
  const res = await apiClient.get<GetTrashResponse>(`/trash?t=${Date.now()}`);
  return {
    ...res.data,
    content: res.data.content.map((note) => ({
      ...note,
      title: normalizeNoteTitle(note.title),
    })),
  };
}

export async function restoreFromTrash(
  id: string
): Promise<{ message: string }> {
  const res = await apiClient.patch<{ message: string }>(`/trash/${id}/restore`, {});
  return res.data;
}

export async function permanentlyDelete(
  id: string
): Promise<{ message: string }> {
  const res = await apiClient.delete<{ message: string }>(`/trash/${id}`);
  return res.data;
}

export default apiClient;
