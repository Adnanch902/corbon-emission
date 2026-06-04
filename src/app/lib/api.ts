const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

type HttpMethod = "GET" | "POST";

export function getToken() {
  return localStorage.getItem("glipToken");
}

export function setToken(token: string) {
  localStorage.setItem("glipToken", token);
}

export function getRefreshToken() {
  return localStorage.getItem("glipRefreshToken");
}

export function setAuthTokens(accessToken: string, refreshToken?: string) {
  setToken(accessToken);
  if (refreshToken) localStorage.setItem("glipRefreshToken", refreshToken);
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });
  if (!res.ok) return null;
  const data = await res.json();
  setAuthTokens(data.accessToken || data.token, data.refreshToken);
  return data.accessToken || data.token;
}

export async function apiRequest<T>(path: string, method: HttpMethod = "GET", body?: unknown): Promise<T> {
  const token = getToken();
  const request = (accessToken: string | null) => fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  let res = await request(token);
  if (res.status === 401 && token) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) res = await request(refreshedToken);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Request failed");
  }

  return res.json() as Promise<T>;
}

export async function signup(name: string, email: string, password: string) {
  return apiRequest<{ token: string; accessToken?: string; refreshToken?: string; user: { id: string; email: string; name: string } }>(
    "/auth/signup",
    "POST",
    { name, email, password }
  );
}

export async function login(email: string, password: string) {
  return apiRequest<{ token: string; accessToken?: string; refreshToken?: string; user: { id: string; email: string; name: string } }>(
    "/auth/login",
    "POST",
    { email, password }
  );
}
