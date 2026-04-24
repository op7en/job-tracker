import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const APPLICATIONS_KEY = ["applications"];

export const useApplications = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Загрузка списка
  const { data: applications = [], isLoading: initialLoading } = useQuery<
    Application[]
  >({
    queryKey: APPLICATIONS_KEY,
    queryFn: async () => {
      try {
        const res = await api.get("/applications");
        return res.data;
      } catch (err) {
        toast.error(t("dashboard.loadFailed"));
        throw err;
      }
    },
  });

  // Добавление
  const addMutation = useMutation({
    mutationFn: async (data: {
      company: string;
      position: string;
      notes: string;
    }) => {
      const res = await api.post("/applications", data);
      return res.data as Application;
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: APPLICATIONS_KEY });
      const previous =
        queryClient.getQueryData<Application[]>(APPLICATIONS_KEY);
      const tempId = -Date.now();
      const optimistic: Application = {
        id: tempId,
        company: newData.company,
        position: newData.position,
        notes: newData.notes,
        status: "applied",
        date_applied: new Date().toISOString(),
      };
      queryClient.setQueryData<Application[]>(APPLICATIONS_KEY, (old = []) => [
        optimistic,
        ...old,
      ]);
      return { previous, tempId };
    },
    onSuccess: (serverData, _vars, context) => {
      queryClient.setQueryData<Application[]>(APPLICATIONS_KEY, (old = []) =>
        old.map((a) => (a.id === context?.tempId ? serverData : a)),
      );
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(APPLICATIONS_KEY, context.previous);
      }
      toast.error(t("dashboard.addFailed"));
    },
  });

  // Обновление статуса
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await api.patch(`/applications/${id}/status`, { status });
      return { id, status };
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: APPLICATIONS_KEY });
      const previous =
        queryClient.getQueryData<Application[]>(APPLICATIONS_KEY);
      queryClient.setQueryData<Application[]>(APPLICATIONS_KEY, (old = []) =>
        old.map((a) => (a.id === id ? { ...a, status } : a)),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(APPLICATIONS_KEY, context.previous);
      }
      toast.error(t("dashboard.updateFailed"));
    },
  });

  // Обновление полей
  const updateApplicationMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Application>;
    }) => {
      await api.patch(`/applications/${id}`, data);
      return { id, data };
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: APPLICATIONS_KEY });
      const previous =
        queryClient.getQueryData<Application[]>(APPLICATIONS_KEY);
      queryClient.setQueryData<Application[]>(APPLICATIONS_KEY, (old = []) =>
        old.map((a) => (a.id === id ? { ...a, ...data } : a)),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(APPLICATIONS_KEY, context.previous);
      }
      toast.error(t("dashboard.updateFailed"));
    },
  });

  // Удаление с undo
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/applications/${id}`);
      return id;
    },
    onError: () => {
      toast.error(t("dashboard.deleteFailed"));
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_KEY });
    },
  });

  // Публичный API — совместим с тем, что было
  const addApplication = (data: {
    company: string;
    position: string;
    notes: string;
  }) => addMutation.mutateAsync(data);

  const updateStatus = (id: number, status: string) =>
    updateStatusMutation.mutateAsync({ id, status });

  const updateApplication = (id: number, data: Partial<Application>) =>
    updateApplicationMutation.mutateAsync({ id, data });

  // Delete с toast-undo (как было)
  const deleteApplication = async (id: number) => {
    const previous = applications.find((a) => a.id === id);
    if (!previous) return;

    queryClient.setQueryData<Application[]>(APPLICATIONS_KEY, (old = []) =>
      old.filter((a) => a.id !== id),
    );

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
              queryClient.setQueryData<Application[]>(
                APPLICATIONS_KEY,
                (old = []) => [...old, previous].sort((a, b) => b.id - a.id),
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
        onClose: () => {
          if (undone) return;
          deleteMutation.mutate(id);
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
