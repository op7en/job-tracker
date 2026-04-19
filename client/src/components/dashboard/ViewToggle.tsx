interface ViewToggleProps {
  view: "table" | "board";
  onViewChange: (view: "table" | "board") => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  view,
  onViewChange,
}) => {
  return (
    <div
      style={{
        display: "flex",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => onViewChange("table")}
        style={{
          background: view === "table" ? "var(--accent)" : "transparent",
          border: "none",
          padding: "5px 8px",
          cursor: "pointer",
          color: view === "table" ? "#fff" : "var(--text-secondary)",
          transition: "all 0.15s",
          display: "flex",
          alignItems: "center",
        }}
        title="Table view"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      </button>
      <button
        onClick={() => onViewChange("board")}
        style={{
          background: view === "board" ? "var(--accent)" : "transparent",
          border: "none",
          padding: "5px 8px",
          cursor: "pointer",
          color: view === "board" ? "#fff" : "var(--text-secondary)",
          transition: "all 0.15s",
          display: "flex",
          alignItems: "center",
        }}
        title="Board view"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="18" rx="1" />
          <rect x="14" y="3" width="7" height="10" rx="1" />
          <line x1="14" y1="17" x2="21" y2="17" />
        </svg>
      </button>
    </div>
  );
};
