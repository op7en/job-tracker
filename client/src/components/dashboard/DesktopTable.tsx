import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBadge } from "./StatusBadge";
import { Spinner } from "./Spinner";
import { SkeletonRow } from "./SkeletonRow";

// Убираем импорт Application, определяем тип прямо здесь
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
  deletingId: number | null;
}

export const DesktopTable: React.FC<DesktopTableProps> = ({
  applications,
  initialLoading,
  onUpdateStatus,
  onDelete,
  deletingId,
}) => {
  const { t } = useTranslation();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

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
  ];

  const statusOptions = [
    { value: "applied", label: t("dashboard.applied") },
    { value: "interview", label: t("dashboard.interview") },
    { value: "rejected", label: t("dashboard.rejected") },
    { value: "offer", label: t("dashboard.offer") },
  ];

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        overflow: "hidden",
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
                colSpan={7}
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
            applications.map((app) => (
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
                <td
                  style={{
                    padding: "11px 16px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                  }}
                >
                  {app.company}
                </td>
                <td
                  style={{
                    padding: "11px 16px",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {app.position}
                </td>
                <td style={{ padding: "11px 16px" }}>
                  <StatusBadge status={app.status} />
                </td>
                <td
                  style={{
                    padding: "11px 16px",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    maxWidth: "180px",
                  }}
                >
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={app.notes || ""}
                  >
                    {app.notes || "—"}
                  </div>
                </td>
                <td
                  style={{
                    padding: "11px 16px",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {app.date_applied.slice(0, 10)}
                </td>
                <td style={{ padding: "11px 16px" }}>
                  <select
                    value={app.status}
                    onChange={(e) => onUpdateStatus(app.id, e.target.value)}
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
                <td style={{ padding: "11px 16px" }}>
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
                      cursor: deletingId === app.id ? "not-allowed" : "pointer",
                      opacity: deletingId === app.id ? 0.5 : 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.borderColor = "var(--danger)";
                      el.style.color = "var(--danger)";
                      el.style.background = "var(--danger-muted)";
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
                    {t("common.delete")}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
