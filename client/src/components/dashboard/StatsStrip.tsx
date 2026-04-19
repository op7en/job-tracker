import React from "react";
import { useTranslation } from "react-i18next";

interface StatsStripProps {
  total: number;
  interview: number;
  offer: number;
  rejected: number;
  responseRate: number;
}

export const StatsStrip: React.FC<StatsStripProps> = ({
  total,
  interview,
  offer,
  rejected,
  responseRate,
}) => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "8px",
        marginBottom: "16px",
      }}
    >
      {[
        {
          label: t("dashboard.stats.total"),
          value: total,
          color: "var(--text-primary)",
        },
        {
          label: t("dashboard.stats.interview"),
          value: interview,
          color: "#f59e0b",
        },
        {
          label: t("dashboard.stats.offers"),
          value: offer,
          color: "var(--success)",
        },
        {
          label: t("dashboard.stats.rejected"),
          value: rejected,
          color: "var(--danger)",
        },
        {
          label: t("dashboard.stats.responseRate"),
          value: `${responseRate}%`,
          color: "var(--accent)",
        },
      ].map(({ label, value, color }) => (
        <div
          key={label}
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "10px 8px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: 600, color }}>
            {value}
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "var(--text-secondary)",
              marginTop: "2px",
            }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};
