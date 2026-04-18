export const SkeletonRow = () => (
  <tr style={{ borderTop: "1px solid var(--border)" }}>
    <style>{`
      @keyframes shimmer {
        0% { background-position: -600px 0; }
        100% { background-position: 600px 0; }
      }
      .skeleton-cell {
        height: 12px;
        border-radius: 4px;
        background: linear-gradient(
          90deg,
          var(--bg-elevated) 25%,
          var(--bg-hover, rgba(0,0,0,0.06)) 50%,
          var(--bg-elevated) 75%
        );
        background-size: 600px 100%;
        animation: shimmer 1.4s ease-in-out infinite;
      }
    `}</style>
    {[140, 120, 80, 200, 90, 110, 60].map((w, i) => (
      <td key={i} style={{ padding: "13px 16px" }}>
        <div className="skeleton-cell" style={{ width: w }} />
      </td>
    ))}
  </tr>
);
