import React from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
}) => (
  <label
    style={{
      display: "flex",
      alignItems: "flex-start",
      cursor: "pointer",
      gap: "10px",
    }}
  >
    <div
      style={{
        position: "relative",
        width: "18px",
        height: "18px",
        flexShrink: 0,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          position: "absolute",
          opacity: 0,
          width: "100%",
          height: "100%",
          cursor: "pointer",
          margin: 0,
        }}
      />
      <div
        style={{
          width: "18px",
          height: "18px",
          background: checked ? "var(--accent)" : "var(--bg-input)",
          border: checked
            ? "1px solid var(--accent)"
            : "1px solid var(--border)",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s",
        }}
      >
        {checked && (
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </div>
    <span
      style={{
        fontSize: "13px",
        color: "var(--text-secondary)",
        lineHeight: "1.5",
      }}
    >
      {label}
    </span>
  </label>
);
