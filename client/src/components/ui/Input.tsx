import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = (props) => (
  <input
    {...props}
    style={{
      width: "100%",
      background: "var(--bg-input)",
      border: "1px solid var(--border)",
      borderRadius: "7px",
      padding: "9px 12px",
      color: "var(--text-primary)",
      fontSize: "14px",
      outline: "none",
      transition: "border-color 0.15s",
    }}
    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-focus)")}
    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
  />
);
