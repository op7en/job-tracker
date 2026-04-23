import axios from "axios";

const api = axios.create({
  baseURL: "https://job-tracker-production-585f.up.railway.app",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
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
