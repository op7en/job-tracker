import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Application } from "../../hooks/useApplications";

const COLUMNS = ["applied", "interview", "offer", "rejected"] as const;

interface KanbanBoardProps {
  applications: Application[];
  onUpdateStatus: (id: number, status: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  onUpdateStatus,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [overColumn, setOverColumn] = useState<string | null>(null);
  const isMobile = window.innerWidth < 1024;

  const columnColors: Record<string, string> = {
    applied: "var(--accent)",
    interview: "#f59e0b",
    offer: "var(--success)",
    rejected: "var(--danger)",
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverColumn(status);
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (draggingId === null) return;
    const app = applications.find((a) => a.id === draggingId);
    if (app && app.status !== status) {
      await onUpdateStatus(draggingId, status);
    }
    setDraggingId(null);
    setOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setOverColumn(null);
  };

  // Мобильный вид: горизонтальный скролл
  if (isMobile) {
    return (
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "12px",
          paddingBottom: "12px",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {COLUMNS.map((status) => {
          const cards = applications.filter((a) => a.status === status);
          const isOver = overColumn === status;

          return (
            <div
              key={status}
              onDragOver={(e) => handleDragOver(e, status)}
              onDrop={(e) => handleDrop(e, status)}
              onDragLeave={() => setOverColumn(null)}
              style={{
                minWidth: "85vw",
                scrollSnapAlign: "start",
                flexShrink: 0,
                background: isOver ? "var(--bg-elevated)" : "var(--bg-surface)",
                border: `1px solid ${isOver ? columnColors[status] : "var(--border)"}`,
                borderRadius: "10px",
                padding: "12px",
                minHeight: "200px",
                transition: "all 0.15s",
              }}
            >
              {/* Заголовок колонки */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: columnColors[status],
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      textTransform: "capitalize",
                    }}
                  >
                    {t(`dashboard.${status}`)}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    background: "var(--bg-elevated)",
                    padding: "2px 7px",
                    borderRadius: "10px",
                  }}
                >
                  {cards.length}
                </span>
              </div>

              {/* Карточки */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {cards.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "24px 0",
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      borderRadius: "8px",
                      border: "1px dashed var(--border)",
                    }}
                  >
                    —
                  </div>
                ) : (
                  cards.map((app) => (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app.id)}
                      onDragEnd={handleDragEnd}
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "10px 12px",
                        cursor: "grab",
                        opacity: draggingId === app.id ? 0.4 : 1,
                        transition: "opacity 0.15s",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
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
                          marginBottom: "8px",
                        }}
                      >
                        {app.position}
                      </div>
                      {app.notes && (
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--text-secondary)",
                            background: "var(--bg-surface)",
                            borderRadius: "5px",
                            padding: "5px 8px",
                            marginBottom: "8px",
                            lineHeight: "1.4",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {app.notes}
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "10px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {app.date_applied.slice(0, 10)}
                        </span>
                        <button
                          onClick={() => onDelete(app.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--text-secondary)",
                            padding: "2px",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "4px",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color =
                              "var(--danger)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color =
                              "var(--text-secondary)";
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Десктопный вид: сетка 4 колонки
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "12px",
        alignItems: "start",
      }}
    >
      {COLUMNS.map((status) => {
        const cards = applications.filter((a) => a.status === status);
        const isOver = overColumn === status;

        return (
          <div
            key={status}
            onDragOver={(e) => handleDragOver(e, status)}
            onDrop={(e) => handleDrop(e, status)}
            onDragLeave={() => setOverColumn(null)}
            style={{
              background: isOver ? "var(--bg-elevated)" : "var(--bg-surface)",
              border: `1px solid ${isOver ? columnColors[status] : "var(--border)"}`,
              borderRadius: "10px",
              padding: "12px",
              minHeight: "200px",
              transition: "all 0.15s",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: columnColors[status],
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    textTransform: "capitalize",
                  }}
                >
                  {t(`dashboard.${status}`)}
                </span>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  background: "var(--bg-elevated)",
                  padding: "2px 7px",
                  borderRadius: "10px",
                }}
              >
                {cards.length}
              </span>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {cards.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px 0",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    borderRadius: "8px",
                    border: "1px dashed var(--border)",
                  }}
                >
                  —
                </div>
              ) : (
                cards.map((app) => (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app.id)}
                    onDragEnd={handleDragEnd}
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      cursor: "grab",
                      opacity: draggingId === app.id ? 0.4 : 1,
                      transition: "opacity 0.15s",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
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
                        marginBottom: "8px",
                      }}
                    >
                      {app.position}
                    </div>
                    {app.notes && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-secondary)",
                          background: "var(--bg-surface)",
                          borderRadius: "5px",
                          padding: "5px 8px",
                          marginBottom: "8px",
                          lineHeight: "1.4",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {app.notes}
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {app.date_applied.slice(0, 10)}
                      </span>
                      <button
                        onClick={() => onDelete(app.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-secondary)",
                          padding: "2px",
                          display: "flex",
                          alignItems: "center",
                          borderRadius: "4px",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "var(--danger)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "var(--text-secondary)";
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
