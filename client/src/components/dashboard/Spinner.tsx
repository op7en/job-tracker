import React from "react";

interface SpinnerProps {
  size?: number;
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 13,
  color = "currentColor",
}) => (
  <>
    <span
      style={{
        width: size,
        height: size,
        border: `1.5px solid transparent`,
        borderTopColor: color,
        borderRightColor: color,
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 0.55s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        flexShrink: 0,
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </>
);
