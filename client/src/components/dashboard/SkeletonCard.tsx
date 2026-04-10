// SkeletonCard.tsx
export const SkeletonCard = () => (
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
