export const SkeletonRow = () => (
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
