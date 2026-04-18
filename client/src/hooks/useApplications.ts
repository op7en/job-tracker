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

  const addApplication = async (data: {
    company: string;
    position: string;
    notes: string;
  }) => {
    await api.post("/applications", data);
    await fetchApplications();
  };

  const updateStatus = async (id: number, status: string) => {
    await api.patch(`/applications/${id}/status`, { status });
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    );
  };

  const deleteApplication = async (id: number) => {
    await api.delete(`/applications/${id}`);
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };
  const updateApplication = async (id: number, data: Partial<Application>) => {
    await api.patch(`/applications/${id}`, data);
    await fetchApplications();
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
