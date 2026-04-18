import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBadge } from "./StatusBadge";
import { Spinner } from "./Spinner";
import { SkeletonRow } from "./SkeletonRow";

interface Application {
  id: number;
  company: string;
  position: string;
  status: string;
  date_applied: string;
  notes: string;
}

interface DesktopTableProps {
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

export const DesktopTable: React.FC<DesktopTableProps> = ({
  applications,
  initialLoading,
  onUpdateStatus,
  onDelete,
  onUpdateApplication,
  deletingId,
}) => {
  const { t } = useTranslation();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
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

  const cancelEditing = () => {
    setEditingId(null);
  };

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

  const thStyle: React.CSSProperties = {
    padding: "10px 16px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 500,
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap",
  };

  const headers = [
    t("dashboard.company"),
    t("dashboard.position"),
    t("dashboard.status"),
    t("dashboard.notes"),
    t("dashboard.applied"),
    t("dashboard.update"),
    "",
    "",
  ];

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--bg-elevated)" }}>
            {headers.map((h, i) => (
              <th key={i} style={thStyle}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {initialLoading ? (
            [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
          ) : applications.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                style={{
                  padding: "56px",
                  textAlign: "center",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                }}
              >
                {t("dashboard.noApplications")}
              </td>
            </tr>
          ) : (
            applications.map((app) => {
              const isEditing = editingId === app.id;
              return (
                <tr
                  key={app.id}
                  onMouseEnter={() => setHoveredRow(app.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    borderTop: "1px solid var(--border)",
                    background:
                      hoveredRow === app.id ? "var(--bg-hover)" : "transparent",
                    transition: "background 0.1s",
                  }}
                >
                  {/* Company */}
                  <td style={{ padding: "11px 16px" }}>
                    {isEditing ? (
                      <input
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEditing();
                          if (e.key === "Escape") cancelEditing();
                        }}
                        autoFocus
                        disabled={isSaving}
                        value={editCompany}
                        onChange={(e) => setEditCompany(e.target.value)}
                        style={{
                          background: "var(--bg-input)",
                          border: "1px solid var(--border)",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          color: "var(--text-primary)",
                          fontSize: "13px",
                          width: "100%",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                        }}
                      >
                        {app.company}
                      </span>
                    )}
                  </td>
                  {/* Position */}
                  <td style={{ padding: "11px 16px" }}>
                    {isEditing ? (
                      <input
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEditing();
                          if (e.key === "Escape") cancelEditing();
                        }}
                        disabled={isSaving}
                        value={editPosition}
                        onChange={(e) => setEditPosition(e.target.value)}
                        style={{
                          background: "var(--bg-input)",
                          border: "1px solid var(--border)",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          color: "var(--text-primary)",
                          fontSize: "13px",
                          width: "100%",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {app.position}
                      </span>
                    )}
                  </td>
                  {/* Status — always badge, never editable here */}
                  <td style={{ padding: "11px 16px" }}>
                    <StatusBadge status={app.status} />
                  </td>
                  {/* Notes */}
                  <td style={{ padding: "11px 16px", maxWidth: "220px" }}>
                    {isEditing ? (
                      <input
                        disabled={isSaving}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEditing();
                          if (e.key === "Escape") cancelEditing();
                        }}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        maxLength={200}
                        style={{
                          background: "var(--bg-input)",
                          border: "1px solid var(--border)",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          color: "var(--text-primary)",
                          fontSize: "13px",
                          width: "100%",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          lineHeight: "1.4",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                        title={app.notes || ""}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {app.notes || "—"}
                        </span>
                      </div>
                    )}
                  </td>
                  {/* Date */}
                  <td style={{ padding: "11px 16px", whiteSpace: "nowrap" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {app.date_applied.slice(0, 10)}
                    </span>
                  </td>
                  {/* Status select (quick update) OR save/cancel when editing */}
                  {isEditing ? (
                    <td colSpan={3} style={{ padding: "11px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <button
                          onClick={saveEditing}
                          disabled={isSaving}
                          style={{
                            background: "var(--accent)",
                            border: "none",
                            borderRadius: "6px",
                            padding: "5px 14px",
                            color: "#fff",
                            fontSize: "12px",
                            cursor: isSaving ? "not-allowed" : "pointer",
                            opacity: isSaving ? 0.7 : 1,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {isSaving ? "..." : t("common.save")}
                        </button>
                        <button
                          disabled={isSaving}
                          onClick={cancelEditing}
                          style={{
                            background: "transparent",
                            border: "1px solid var(--border)",
                            borderRadius: "6px",
                            padding: "5px 14px",
                            color: "var(--text-secondary)",
                            fontSize: "12px",
                            cursor: isSaving ? "not-allowed" : "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {t("common.cancel")}
                        </button>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td style={{ padding: "11px 16px" }}>
                        <select
                          value={app.status}
                          onChange={(e) =>
                            onUpdateStatus(app.id, e.target.value)
                          }
                          style={{
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
                      </td>
                      {/* Actions */}
                      <td style={{ padding: "11px 16px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={() => startEditing(app)}
                            style={{
                              background: "transparent",
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
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLButtonElement;
                              el.style.borderColor = "var(--accent)";
                              el.style.color = "var(--accent)";
                              el.style.background = "var(--accent-muted)";
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLButtonElement;
                              el.style.borderColor = "var(--border)";
                              el.style.color = "var(--text-secondary)";
                              el.style.background = "transparent";
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
                              background: "transparent",
                              border: "1px solid var(--border)",
                              borderRadius: "6px",
                              padding: "5px 10px",
                              color: "var(--text-secondary)",
                              fontSize: "12px",
                              cursor:
                                deletingId === app.id
                                  ? "not-allowed"
                                  : "pointer",
                              opacity: deletingId === app.id ? 0.5 : 1,
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                            onMouseEnter={(e) => {
                              if (deletingId !== app.id) {
                                const el = e.currentTarget as HTMLButtonElement;
                                el.style.borderColor = "var(--danger)";
                                el.style.color = "var(--danger)";
                                el.style.background = "var(--danger-muted)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLButtonElement;
                              el.style.borderColor = "var(--border)";
                              el.style.color = "var(--text-secondary)";
                              el.style.background = "transparent";
                            }}
                          >
                            {deletingId === app.id ? (
                              <Spinner size={11} />
                            ) : (
                              <svg
                                width="13"
                                height="13"
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
                      </td>
                      <td />
                    </>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
