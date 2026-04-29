import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  withCredentials: true,
});

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const hasAccessToken = () => Boolean(accessToken);

export const clearAccessToken = () => {
  accessToken = null;
};

export const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh")
      .then((res) => {
        const token = (res.data?.accessToken as string | undefined) ?? null;
        setAccessToken(token);
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

export const warmUpApi = async (): Promise<void> => {
  await api.get("/health", { timeout: 20000 });
};

api.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
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
