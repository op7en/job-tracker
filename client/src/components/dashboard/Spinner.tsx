import React from "react";

export const Spinner: React.FC<{ size?: number }> = ({ size = 13 }) => (
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
