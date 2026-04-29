import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import type { TFunction } from "i18next";
import { fetchActivityLog } from "../../api/axios";
import type { Application } from "../../hooks/useApplications";

interface CreatedPayload {
  company: string;
  position: string;
}

interface StatusChangedPayload {
  status: string;
}

type UpdatedPayload = Record<string, unknown>;

type ActivityLogType = "created" | "status_changed" | "updated";

interface ActivityLog {
  id: number;
  type: ActivityLogType;
  payload: CreatedPayload | StatusChangedPayload | UpdatedPayload;
  created_at: string;
}

interface ActivityModalProps {
  app: Application | null;
  onClose: () => void;
}

const EVENT_ICONS: Record<string, string> = {
  created: "✦",
  status_changed: "◈",
  updated: "✎",
};

const LOCALE_MAP: Record<string, string> = {
  en: "en-GB",
  it: "it-IT",
  ru: "ru-RU",
};

const resolveLocale = (language: string): string => {
  const normalized = language.toLowerCase();
  const baseLanguage = normalized.split("-")[0];
  return LOCALE_MAP[normalized] ?? LOCALE_MAP[baseLanguage] ?? LOCALE_MAP.en;
};

const groupByDate = (logs: ActivityLog[], t: TFunction, language: string) => {
  const groups: Record<string, ActivityLog[]> = {};
  const locale = resolveLocale(language);

  logs.forEach((log) => {
    const date = new Date(log.created_at);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let label: string;
    if (date.toDateString() === today.toDateString()) {
      label = t("activity.today");
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = t("activity.yesterday");
    } else {
      label = date.toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(log);
  });
  return groups;
};

const formatEvent = (log: ActivityLog, t: TFunction): string => {
  if (log.type === "created") {
    const p = log.payload as CreatedPayload;
    return t("activity.created", {
      company: p.company,
      position: p.position,
    });
  }
  if (log.type === "status_changed") {
    const p = log.payload as StatusChangedPayload;
    const translatedStatus = p.status
      ? t(`dashboard.${p.status}`, p.status)
      : "";
    return t("activity.statusChanged", { status: translatedStatus });
  }
  if (log.type === "updated") {
    const p = log.payload as UpdatedPayload;
    const fields = Object.keys(p || {})
      .map((key) => t(`dashboard.${key}`, key))
      .join(", ");
    return t("activity.updated", { fields });
  }
  return log.type;
};

export const ActivityModal: React.FC<ActivityModalProps> = ({
  app,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const appId = app?.id;
  const { data: logs = [], isLoading: loading } = useQuery<ActivityLog[]>({
    queryKey: ["activity", appId],
    queryFn: async () => {
      if (!appId) return [];
      const res = await fetchActivityLog(appId);
      return res.data;
    },
    enabled: Boolean(appId),
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!app) return null;

  const grouped = groupByDate(logs, t, i18n.resolvedLanguage || i18n.language);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {app.company}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                marginTop: "2px",
              }}
            >
              {app.position}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: "18px",
              lineHeight: 1,
              padding: "0 4px",
            }}
          >
            ×
          </button>
        </div>

        {/* Timeline */}
        <div style={{ overflowY: "auto", padding: "16px 20px" }}>
          {loading ? (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-secondary)",
                fontSize: "13px",
                padding: "24px 0",
              }}
            >
              {t("activity.loading")}
            </div>
          ) : logs.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-secondary)",
                fontSize: "13px",
                padding: "24px 0",
              }}
            >
              {t("activity.noActivity")}
            </div>
          ) : (
            Object.entries(grouped).map(([date, dateLogs]) => (
              <div key={date} style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "10px",
                  }}
                >
                  {date}
                </div>
                {dateLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginBottom: "10px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        flexShrink: 0,
                        color: "var(--accent)",
                      }}
                    >
                      {EVENT_ICONS[log.type] || "•"}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "var(--text-primary)",
                        }}
                      >
                        {formatEvent(log, t)}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-secondary)",
                          marginTop: "2px",
                        }}
                      >
                        {new Date(log.created_at).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
