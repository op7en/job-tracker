import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBadge } from "./StatusBadge";
import { Spinner } from "./Spinner";
import { SkeletonCard } from "./SkeletonCard";

interface Application {
  id: number;
  company: string;
  position: string;
  status: string;
  date_applied: string;
  notes: string;
}

interface MobileCardsProps {
  applications: Application[];
  initialLoading: boolean;
  onUpdateStatus: (id: number, status: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdateApplication: (
    id: number,
    data: Partial<Application>,
  ) => Promise<void>;
  deletingId: number | null;
}

export const MobileCards: React.FC<MobileCardsProps> = ({
  applications,
  initialLoading,
  onUpdateStatus,
  onDelete,
  onUpdateApplication,
  deletingId,
}) => {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCompany, setEditCompany] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const statusOptions = [
    { value: "applied", label: t("dashboard.applied") },
    { value: "interview", label: t("dashboard.interview") },
    { value: "offer", label: t("dashboard.offer") },
    { value: "rejected", label: t("dashboard.rejected") },
  ];

  const startEditing = (app: Application) => {
    setEditingId(app.id);
    setEditCompany(app.company);
    setEditPosition(app.position);
    setEditNotes(app.notes || "");
  };

  const cancelEditing = () => setEditingId(null);

  const saveEditing = async () => {
    if (!editCompany.trim() || !editPosition.trim()) return;
    setIsSaving(true);
    await onUpdateApplication(editingId!, {
      company: editCompany,
      position: editPosition,
      notes: editNotes,
    });
    setIsSaving(false);
    setEditingId(null);
  };

  if (initialLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[...Array(3)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48px 16px",
          color: "var(--text-secondary)",
          fontSize: "14px",
        }}
      >
        {t("dashboard.noApplications")}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {applications.map((app) => {
        const isEditing = editingId === app.id;
        return (
          <div
            key={app.id}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "14px 16px",
            }}
          >
            {isEditing ? (
              <>
                <input
                  disabled={isSaving}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEditing();
                    if (e.key === "Escape") cancelEditing();
                  }}
                  autoFocus
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  placeholder={t("dashboard.company")}
                  style={{
                    background: "var(--bg-input)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    width: "100%",
                    marginBottom: "8px",
                    boxSizing: "border-box",
                  }}
                />
                <input
                  disabled={isSaving}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEditing();
                    if (e.key === "Escape") cancelEditing();
                  }}
                  value={editPosition}
                  onChange={(e) => setEditPosition(e.target.value)}
                  placeholder={t("dashboard.position")}
                  style={{
                    background: "var(--bg-input)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    width: "100%",
                    marginBottom: "8px",
                    boxSizing: "border-box",
                  }}
                />
                <input
                  disabled={isSaving}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEditing();
                    if (e.key === "Escape") cancelEditing();
                  }}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder={t("dashboard.notes")}
                  maxLength={200}
                  style={{
                    background: "var(--bg-input)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    width: "100%",
                    marginBottom: "12px",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    disabled={isSaving}
                    onClick={saveEditing}
                    style={{
                      flex: 1,
                      background: "var(--accent)",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px",
                      color: "#fff",
                      fontSize: "13px",
                      cursor: isSaving ? "not-allowed" : "pointer",
                      opacity: isSaving ? 0.85 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      transition: "opacity 0.15s",
                    }}
                  >
                    {isSaving && <Spinner size={12} color="#fff" />}
                    {t("common.save")}
                  </button>
                  <button
                    disabled={isSaving}
                    onClick={cancelEditing}
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      padding: "8px",
                      color: "var(--text-secondary)",
                      fontSize: "13px",
                      cursor: isSaving ? "not-allowed" : "pointer",
                    }}
                  >
                    {t("common.cancel")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        marginBottom: "2px",
                      }}
                    >
                      {app.company}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {app.position}
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                {app.notes && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      marginBottom: "10px",
                      lineHeight: "1.4",
                      padding: "7px 10px",
                      background: "var(--bg-elevated)",
                      borderRadius: "6px",
                    }}
                  >
                    {app.notes}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      background: "var(--bg-elevated)",
                      padding: "4px 8px",
                      borderRadius: "5px",
                    }}
                  >
                    {app.date_applied.slice(0, 10)}
                  </span>
                  <select
                    value={app.status}
                    onChange={(e) => onUpdateStatus(app.id, e.target.value)}
                    style={{
                      flex: 1,
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      padding: "5px 8px",
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    {statusOptions.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => startEditing(app)}
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      padding: "5px 10px",
                      color: "var(--text-secondary)",
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(app.id)}
                    disabled={deletingId === app.id}
                    style={{
                      background: "var(--danger-muted)",
                      border: "1px solid transparent",
                      borderRadius: "6px",
                      padding: "5px 10px",
                      color: "var(--danger)",
                      fontSize: "12px",
                      cursor: deletingId === app.id ? "not-allowed" : "pointer",
                      opacity: deletingId === app.id ? 0.5 : 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {deletingId === app.id ? (
                      <Spinner size={11} />
                    ) : (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
