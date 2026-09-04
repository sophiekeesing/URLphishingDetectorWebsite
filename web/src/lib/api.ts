export const API_URL = import.meta.env.PUBLIC_API_URL ?? "http://localhost:4000";

/** Server-side fetch helper that forwards the visitor's cookie header to the API. */
export async function apiFetch(path: string, cookieHeader: string | null, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  if (cookieHeader) headers.set("cookie", cookieHeader);
  return fetch(`${API_URL}${path}`, { ...init, headers });
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export async function getCurrentUser(cookieHeader: string | null): Promise<CurrentUser | null> {
  const res = await apiFetch("/api/auth/me", cookieHeader);
  if (!res.ok) return null;
  return res.json();
}
