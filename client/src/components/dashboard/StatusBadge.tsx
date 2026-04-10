import React from "react";
import { useTranslation } from "react-i18next";

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  applied: {
    color: "var(--accent)",
    bg: "var(--accent-muted)",
  },
  interview: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
  rejected: {
    color: "var(--danger)",
    bg: "var(--danger-muted)",
  },
  offer: {
    color: "var(--success)",
    bg: "var(--success-muted)",
  },
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const { t } = useTranslation();

  const cfg = STATUS_CONFIG[status] ?? {
    color: "var(--text-secondary)",
    bg: "var(--bg-elevated)",
  };

  // Берём перевод из dashboard.{status}, если нет — показываем оригинальный status
  const label = t(`dashboard.${status}`, status);

  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: 500,
        padding: "3px 8px",
        borderRadius: "20px",
        color: cfg.color,
        background: cfg.bg,
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </span>
  );
};
