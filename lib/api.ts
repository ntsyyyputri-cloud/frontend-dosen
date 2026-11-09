const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("gradia_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Strict Interceptor: Jika server menolak token (401 Unauthorized / 403 Forbidden)
  if (response.status === 401 || response.status === 403) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("gradia_token");
      localStorage.removeItem("gradia_role");
      localStorage.removeItem("gradia_admin");
      localStorage.removeItem("gradia_lecturer");
      document.cookie = "gradia_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "gradia_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

      // Segera alihkan ke halaman login jika berada di area terproteksi
      if (!window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth/login";
      }
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Terjadi kesalahan pada server.");
  }

  return data as T;
}
