import React from "react";
import { useTranslation } from "react-i18next";
import { StatusBadge } from "./StatusBadge";
import { Spinner } from "./Spinner";
import { SkeletonCard } from "./SkeletonCard";

// Определяем тип прямо здесь
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
  deletingId: number | null;
}

export const MobileCards: React.FC<MobileCardsProps> = ({
  applications,
  initialLoading,
  onUpdateStatus,
  onDelete,
  deletingId,
}) => {
  const { t } = useTranslation();

  const statusOptions = [
    { value: "applied", label: t("dashboard.applied") },
    { value: "interview", label: t("dashboard.interview") },
    { value: "rejected", label: t("dashboard.rejected") },
    { value: "offer", label: t("dashboard.offer") },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {initialLoading ? (
        [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
      ) : applications.length === 0 ? (
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
      ) : (
        applications.map((app) => (
          <div
            key={app.id}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "14px 16px",
              transition: "border-color 0.15s",
            }}
          >
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
                  style={{ fontSize: "12px", color: "var(--text-secondary)" }}
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
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  background: "var(--bg-elevated)",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  whiteSpace: "nowrap",
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
                  minWidth: 0,
                }}
              >
                {statusOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

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
                  whiteSpace: "nowrap",
                  flexShrink: 0,
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
            </div>
          </div>
        ))
      )}
    </div>
  );
};
