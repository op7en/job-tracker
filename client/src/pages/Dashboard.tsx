import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import ThemeToggle from "../components/ThemeToggle";
import { useNavigate } from "react-router-dom";
interface Application {
  id: number;
  company: string;
  position: string;
  status: string;
  date_applied: string;
  notes: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  applied: {
    label: "Applied",
    color: "var(--accent)",
    bg: "var(--accent-muted)",
  },
  interview: {
    label: "Interview",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
  rejected: {
    label: "Rejected",
    color: "var(--danger)",
    bg: "var(--danger-muted)",
  },
  offer: {
    label: "Offer",
    color: "var(--success)",
    bg: "var(--success-muted)",
  },
};

const Spinner = ({ size = 13 }: { size?: number }) => (
  <>
    <span
      style={{
        width: size,
        height: size,
        border: "1.5px solid rgba(255,255,255,0.25)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 0.6s linear infinite",
        flexShrink: 0,
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </>
);

const SkeletonRow = () => (
  <tr style={{ borderTop: "1px solid var(--border)" }}>
    {[140, 120, 80, 160, 90, 100, 70].map((w, i) => (
      <td key={i} style={{ padding: "12px 16px" }}>
        <div
          style={{
            height: "12px",
            width: w,
            borderRadius: "4px",
            background: "var(--bg-elevated)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </td>
    ))}
    <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
  </tr>
);

const SkeletonCard = () => (
  <div
    style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "16px",
      animation: "pulse 1.5s ease-in-out infinite",
    }}
  >
    {[
      ["60%", "12px"],
      ["40%", "10px"],
      ["30%", "10px"],
    ].map(([w, h], i) => (
      <div
        key={i}
        style={{
          height: h,
          width: w,
          borderRadius: "4px",
          background: "var(--bg-elevated)",
          marginBottom: i < 2 ? "10px" : 0,
        }}
      />
    ))}
    <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    color: "var(--text-secondary)",
    bg: "var(--bg-elevated)",
  };
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
      {cfg.label}
    </span>
  );
};

const Dashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [notes, setNotes] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navigate = useNavigate();
  useEffect(() => {
    api
      .get("/applications")
      .then((res) => setApplications(res.data))
      .catch(() => toast.error("Failed to load applications"))
      .finally(() => setInitialLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!company.trim() || !position.trim())
      return toast.warning("Company and position are required");
    setIsAdding(true);
    try {
      await api.post("/applications", { company, position, notes });
      const res = await api.get("/applications");
      setApplications(res.data);
      setCompany("");
      setPosition("");
      setNotes("");
      toast.success(`Added — ${company}`);
    } catch {
      toast.error("Failed to add application");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await api.delete(`/applications/${id}`);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      toast.success("Removed");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/applications/${id}/status`, { status });
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a)),
      );
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const inputStyle: React.CSSProperties = {
    background: "var(--bg-input)",
    border: "1px solid var(--border)",
    borderRadius: "7px",
    padding: "8px 12px",
    color: "var(--text-primary)",
    fontSize: "13px",
    outline: "none",
    transition: "border-color 0.15s",
    width: "100%",
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

  // Stats for mobile header
  const stats = {
    total: applications.length,
    interview: applications.filter((a) => a.status === "interview").length,
    offer: applications.filter((a) => a.status === "offer").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-app)" }}>
      {/* ── Header ── */}
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
            JobTracker
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            {applications.length} application
            {applications.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={handleLogout}
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
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
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
        {/* ── Mobile stats strip ── */}
        {isMobile && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            {[
              {
                label: "Total",
                value: stats.total,
                color: "var(--text-primary)",
              },
              { label: "Interview", value: stats.interview, color: "#f59e0b" },
              { label: "Offers", value: stats.offer, color: "var(--success)" },
              {
                label: "Rejected",
                value: stats.rejected,
                color: "var(--danger)",
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
        )}

        {/* ── Add form ── */}
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "16px",
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {[
            { placeholder: "Company", value: company, setter: setCompany },
            { placeholder: "Position", value: position, setter: setPosition },
            { placeholder: "Notes (optional)", value: notes, setter: setNotes },
          ].map(({ placeholder, value, setter }) => (
            <input
              key={placeholder}
              placeholder={placeholder}
              value={value}
              onChange={(e) => setter(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              style={{ ...inputStyle, flex: "1 1 140px" }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--border-focus)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            />
          ))}
          <button
            onClick={handleAdd}
            disabled={isAdding}
            style={{
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "7px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: isAdding ? "not-allowed" : "pointer",
              opacity: isAdding ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: "7px",
              transition: "background 0.15s, opacity 0.15s",
              whiteSpace: "nowrap",
              width: isMobile ? "100%" : "auto",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              if (!isAdding)
                (e.currentTarget as HTMLButtonElement).style.background =
                  "var(--accent-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--accent)";
            }}
          >
            {isAdding ? (
              <Spinner />
            ) : (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
            {isAdding ? "Adding..." : "Add application"}
          </button>
        </div>

        {/* ── DESKTOP: Table ── */}
        {!isMobile && (
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
                  {[
                    "Company",
                    "Position",
                    "Status",
                    "Notes",
                    "Applied",
                    "Update",
                    "",
                  ].map((h, i) => (
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
                      No applications yet — add one above
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
                          hoveredRow === app.id
                            ? "var(--bg-hover)"
                            : "transparent",
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
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {app.notes || "—"}
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
                          onChange={(e) => handleStatus(app.id, e.target.value)}
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
                          <option value="applied">Applied</option>
                          <option value="interview">Interview</option>
                          <option value="rejected">Rejected</option>
                          <option value="offer">Offer</option>
                        </select>
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <button
                          onClick={() => handleDelete(app.id)}
                          disabled={deletingId === app.id}
                          style={{
                            background: "transparent",
                            border: "1px solid var(--border)",
                            borderRadius: "6px",
                            padding: "5px 10px",
                            color: "var(--text-secondary)",
                            fontSize: "12px",
                            cursor:
                              deletingId === app.id ? "not-allowed" : "pointer",
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
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── MOBILE: Cards ── */}
        {isMobile && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
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
                No applications yet — add one above
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
                  onTouchStart={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border-focus)")
                  }
                  onTouchEnd={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border)")
                  }
                >
                  {/* Card top row */}
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

                  {/* Notes */}
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

                  {/* Date + controls row */}
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
                      onChange={(e) => handleStatus(app.id, e.target.value)}
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
                      <option value="applied">Applied</option>
                      <option value="interview">Interview</option>
                      <option value="rejected">Rejected</option>
                      <option value="offer">Offer</option>
                    </select>

                    <button
                      onClick={() => handleDelete(app.id)}
                      disabled={deletingId === app.id}
                      style={{
                        background: "var(--danger-muted)",
                        border: "1px solid transparent",
                        borderRadius: "6px",
                        padding: "5px 10px",
                        color: "var(--danger)",
                        fontSize: "12px",
                        cursor:
                          deletingId === app.id ? "not-allowed" : "pointer",
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
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
