export const SkeletonCard = () => (
  <div
    style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "14px 16px",
    }}
  >
    <style>{`
      @keyframes shimmer {
        0% { background-position: -400px 0; }
        100% { background-position: 400px 0; }
      }
      .skeleton-bar {
        border-radius: 4px;
        background: linear-gradient(
          90deg,
          var(--bg-elevated) 25%,
          var(--bg-hover, rgba(0,0,0,0.06)) 50%,
          var(--bg-elevated) 75%
        );
        background-size: 400px 100%;
        animation: shimmer 1.4s ease-in-out infinite;
      }
    `}</style>

    {/* Top row: company + badge placeholder */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
      }}
    >
      <div className="skeleton-bar" style={{ height: "13px", width: "45%" }} />
      <div
        className="skeleton-bar"
        style={{ height: "20px", width: "22%", borderRadius: "6px" }}
      />
    </div>

    {/* Position */}
    <div
      className="skeleton-bar"
      style={{ height: "11px", width: "35%", marginBottom: "12px" }}
    />

    {/* Notes */}
    <div
      className="skeleton-bar"
      style={{ height: "10px", width: "75%", marginBottom: "6px" }}
    />
    <div
      className="skeleton-bar"
      style={{ height: "10px", width: "55%", marginBottom: "14px" }}
    />

    {/* Bottom row: date + select + buttons */}
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <div
        className="skeleton-bar"
        style={{ height: "24px", width: "70px", borderRadius: "5px" }}
      />
      <div
        className="skeleton-bar"
        style={{ height: "28px", flex: 1, borderRadius: "6px" }}
      />
      <div
        className="skeleton-bar"
        style={{ height: "28px", width: "32px", borderRadius: "6px" }}
      />
      <div
        className="skeleton-bar"
        style={{ height: "28px", width: "32px", borderRadius: "6px" }}
      />
    </div>
  </div>
);
