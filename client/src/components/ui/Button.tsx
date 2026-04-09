import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  loadingText,
  variant = "primary",
  style,
  disabled,
  ...props
}) => {
  const isDisabled = loading || disabled;

  const baseStyle: React.CSSProperties = {
    width: "100%",
    color: variant === "primary" ? "#fff" : "var(--text-primary)",
    background: variant === "primary" ? "var(--accent)" : "transparent",
    border: variant === "secondary" ? "1px solid var(--border)" : "none",
    borderRadius: "7px",
    padding: "9px 12px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.7 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "opacity 0.15s, background 0.15s",
  };

  return (
    <button
      {...props}
      disabled={isDisabled}
      style={{ ...baseStyle, ...style }}
      onMouseEnter={(e) => {
        if (!isDisabled && variant === "primary") {
          e.currentTarget.style.background = "var(--accent-hover)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled && variant === "primary") {
          e.currentTarget.style.background = "var(--accent)";
        }
      }}
    >
      {loading && (
        <span
          style={{
            width: "13px",
            height: "13px",
            border: "2px solid rgba(255,255,255,0.3)",
            borderTopColor: variant === "primary" ? "#fff" : "var(--accent)",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.6s linear infinite",
          }}
        />
      )}
      {loading && loadingText ? loadingText : children}
    </button>
  );
};
