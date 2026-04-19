import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ThemeToggle from "../components/ThemeToggle";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useApplications } from "../hooks/useApplications";
import { StatsStrip } from "../components/dashboard/StatsStrip";
import { AddApplicationForm } from "../components/dashboard/AddApplicationForm";
import { DesktopTable } from "../components/dashboard/DesktopTable";
import { MobileCards } from "../components/dashboard/MobileCards";
import { KanbanBoard } from "../components/dashboard/KanbanBoard";
import LogoutButton from "../components/LogoutButton";
interface Application {
  id: number;
  company: string;
  position: string;
  status: string;
  date_applied: string;
  notes: string;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const {
    applications,
    initialLoading,
    addApplication,
    updateStatus,
    deleteApplication,
    updateApplication, // <-- добавь это в хуке
  } = useApplications();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAdd = async (data: {
    company: string;
    position: string;
    notes: string;
  }) => {
    await addApplication(data);
    toast.success(`✅ ${data.company} ${t("dashboard.added")}`);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    await updateStatus(id, status);
    toast.success(`✅ ${t("dashboard.markedAs")} ${t(`dashboard.${status}`)}`);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteApplication(id);
    } catch {
      toast.error(t("dashboard.deleteFailed"));
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateApplication = async (
    id: number,
    data: Partial<Application>,
  ) => {
    await updateApplication(id, data);
    toast.success(t("dashboard.updated"));
  };

  const stats = {
    total: applications.length,
    interview: applications.filter((a) => a.status === "interview").length,
    offer: applications.filter((a) => a.status === "offer").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    responseRate:
      applications.length > 0
        ? Math.round(
            (applications.filter((a) => a.status !== "applied").length /
              applications.length) *
              100,
          )
        : 0,
  };

  const [view, setView] = useState<"table" | "board">("table");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-app)" }}>
      {/* Header — без изменений */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "52px",
          position: "sticky",
          top: 0,
          background: "var(--bg-app)",
          backdropFilter: "blur(8px)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "22px",
              height: "22px",
              background: "var(--accent)",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--text-primary)",
            }}
          >
            {t("dashboard.title")}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {!isMobile && (
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              {t("dashboard.applicationsCount", { count: applications.length })}
            </span>
          )}
          <LanguageSwitcher />
          <div
            style={{
              display: "flex",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            {(["table", "board"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  background: view === v ? "var(--accent)" : "transparent",
                  border: "none",
                  padding: "5px 10px",
                  fontSize: "12px",
                  color: view === v ? "#fff" : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {v === "table"
                  ? t("dashboard.viewTable")
                  : t("dashboard.viewBoard")}
              </button>
            ))}
          </div>
          <LogoutButton />
          <ThemeToggle />
        </div>
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: isMobile ? "16px" : "28px 24px",
        }}
      >
        <StatsStrip {...stats} />

        <AddApplicationForm onAdd={handleAdd} isMobile={isMobile} />

        {isMobile ? (
          <MobileCards
            applications={applications}
            initialLoading={initialLoading}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
            onUpdateApplication={handleUpdateApplication}
            deletingId={deletingId}
          />
        ) : view === "board" ? (
          <KanbanBoard
            applications={applications}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
          />
        ) : (
          <DesktopTable
            applications={applications}
            initialLoading={initialLoading}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
            onUpdateApplication={handleUpdateApplication}
            deletingId={deletingId}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
