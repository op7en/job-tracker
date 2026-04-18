import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import api from "../api/axios";

export interface Application {
  id: number;
  company: string;
  position: string;
  status: string;
  date_applied: string;
  notes: string;
}

export const useApplications = () => {
  const { t } = useTranslation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(res.data);
    } catch {
      toast.error(t("dashboard.loadFailed"));
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Optimistic: вставляем с temp id сразу, заменяем реальной записью после ответа сервера
  const addApplication = async (data: {
    company: string;
    position: string;
    notes: string;
  }) => {
    const tempId = -Date.now();
    const optimistic: Application = {
      id: tempId,
      company: data.company,
      position: data.position,
      notes: data.notes,
      status: "applied",
      date_applied: new Date().toISOString(),
    };

    setApplications((prev) => [optimistic, ...prev]);

    try {
      const res = await api.post("/applications", data);
      setApplications((prev) =>
        prev.map((a) => (a.id === tempId ? res.data : a)),
      );
    } catch (err) {
      setApplications((prev) => prev.filter((a) => a.id !== tempId));
      toast.error(t("dashboard.addFailed"));
      throw err;
    }
  };

  // Optimistic: статус меняется мгновенно, откат при ошибке
  const updateStatus = async (id: number, status: string) => {
    const previous = applications.find((a) => a.id === id);
    if (!previous) return;

    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    );

    try {
      await api.patch(`/applications/${id}/status`, { status });
    } catch {
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: previous.status } : a)),
      );
      toast.error(t("dashboard.updateFailed"));
    }
  };

  // Optimistic: поля обновляются мгновенно, откат при ошибке
  const updateApplication = async (id: number, data: Partial<Application>) => {
    const previous = applications.find((a) => a.id === id);
    if (!previous) return;

    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a)),
    );

    try {
      await api.patch(`/applications/${id}`, data);
    } catch (err) {
      setApplications((prev) => prev.map((a) => (a.id === id ? previous : a)));
      toast.error(t("dashboard.updateFailed"));
      throw err;
    }
  };

  // Undo delete: убираем из стейта мгновенно, даём 5 секунд на отмену
  const deleteApplication = async (id: number) => {
    const previous = applications.find((a) => a.id === id);
    if (!previous) return;

    // убираем из UI мгновенно
    setApplications((prev) => prev.filter((a) => a.id !== id));

    let undone = false;

    toast(
      ({ closeToast }) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            width: "100%",
          }}
        >
          <span style={{ fontSize: "13px" }}>{t("dashboard.removed")}</span>
          <button
            onClick={() => {
              undone = true;
              // возвращаем запись на место
              setApplications((prev) =>
                [...prev, previous].sort((a, b) => b.id - a.id),
              );
              closeToast();
            }}
            style={{
              background: "transparent",
              border: "1px solid currentColor",
              borderRadius: "5px",
              padding: "3px 10px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              color: "inherit",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {t("common.undo")}
          </button>
        </div>
      ),
      {
        autoClose: 5000,
        onClose: async () => {
          if (undone) return; // пользователь нажал Undo — DELETE не отправляем
          try {
            await api.delete(`/applications/${id}`);
          } catch {
            // сервер не удалил — возвращаем
            setApplications((prev) =>
              [...prev, previous].sort((a, b) => b.id - a.id),
            );
            toast.error(t("dashboard.deleteFailed"));
          }
        },
      },
    );
  };

  return {
    applications,
    initialLoading,
    addApplication,
    updateStatus,
    deleteApplication,
    updateApplication,
  };
};
