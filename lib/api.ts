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
  DeleteContentRequest,
  ShareLinkRequest,
  ShareLink,
  SharedBrainResponse,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
  const res = await apiClient.get<GetContentResponse>("/content");
  return res.data;
}

export async function createContent(
  data: CreateContentRequest
): Promise<CreateContentResponse> {
  const res = await apiClient.post<CreateContentResponse>("/content", data);
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
  data: DeleteContentRequest
): Promise<{ message: string }> {
  const res = await apiClient.delete<{ message: string }>("/content", {
    data,
  });
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
  return res.data;
}

export default apiClient;
