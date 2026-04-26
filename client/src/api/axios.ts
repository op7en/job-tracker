import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  withCredentials: true,
});

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;
let csrfToken: string | null = null;

const readCookie = (name: string): string | null => {
  const encoded = `${name}=`;
  const row = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(encoded));
  if (!row) return null;
  return decodeURIComponent(row.slice(encoded.length));
};

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const setCsrfToken = (token: string | null) => {
  csrfToken = token;
};

export const hasAccessToken = () => Boolean(accessToken);

export const clearAccessToken = () => {
  accessToken = null;
  csrfToken = null;
};

export const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh")
      .then((res) => {
        const token = (res.data?.accessToken as string | undefined) ?? null;
        const csrf = (res.data?.csrfToken as string | undefined) ?? null;
        setAccessToken(token);
        csrfToken = csrf ?? readCookie("csrf_token");
        return token;
      })
      .catch(() => {
        clearAccessToken();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

api.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  const needsCsrf =
    config.url?.includes("/auth/refresh") ||
    config.url?.includes("/auth/logout");
  if (needsCsrf && config.headers) {
    config.headers["x-csrf-token"] = csrfToken ?? readCookie("csrf_token") ?? "";
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthRefreshCall = original?.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !original?._retry && !isAuthRefreshCall) {
      original._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
    }

    if (error.response?.status === 401) {
      clearAccessToken();
      // не редиректим, если уже на /login или /register, чтобы не зациклить
      const path = window.location.pathname;
      if (path !== "/" && path !== "/register") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export const fetchActivityLog = (applicationId: number) =>
  api.get(`/applications/${applicationId}/activity`);

export default api;
