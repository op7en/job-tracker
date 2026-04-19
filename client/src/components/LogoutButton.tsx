import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        background: "transparent",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        padding: "6px 8px",
        color: "var(--text-secondary)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
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
      title={t("common.signOut")}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    </button>
  );
};

export default LogoutButton;
