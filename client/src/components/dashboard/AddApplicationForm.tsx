import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Spinner } from "./Spinner";

interface AddApplicationFormProps {
  onAdd: (data: {
    company: string;
    position: string;
    notes: string;
  }) => Promise<void>;
  isMobile: boolean;
}

export const AddApplicationForm: React.FC<AddApplicationFormProps> = ({
  onAdd,
  isMobile,
}) => {
  const { t } = useTranslation();
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [notes, setNotes] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async () => {
    if (!company.trim() || !position.trim()) {
      toast.warning(t("dashboard.fillRequired"));
      return;
    }
    setIsAdding(true);
    try {
      await onAdd({ company, position, notes });
      setCompany("");
      setPosition("");
      setNotes("");
    } finally {
      setIsAdding(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: "var(--bg-input)",
    border: "1px solid var(--border)",
    borderRadius: "7px",
    padding: "8px 12px",
    color: "var(--text-primary)",
    fontSize: "13px",
    outline: "none",
    transition: "border-color 0.15s",
    width: "100%",
  };

  const placeholders = [
    { placeholder: t("dashboard.company"), value: company, setter: setCompany },
    {
      placeholder: t("dashboard.position"),
      value: position,
      setter: setPosition,
    },
    {
      placeholder: t("dashboard.notes"),
      value: notes,
      setter: setNotes,
      maxLength: 200,
    },
  ];

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        padding: "16px",
        marginBottom: "20px",
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      {placeholders.map(({ placeholder, value, setter, maxLength }) => (
        <input
          key={placeholder}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setter(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          maxLength={maxLength}
          style={{ ...inputStyle, flex: "1 1 140px" }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--border-focus)")
          }
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        />
      ))}
      <button
        onClick={handleSubmit}
        disabled={isAdding}
        style={{
          background: "var(--accent)",
          color: "#fff",
          border: "none",
          borderRadius: "7px",
          padding: "8px 16px",
          fontSize: "13px",
          fontWeight: 500,
          cursor: isAdding ? "not-allowed" : "pointer",
          opacity: isAdding ? 0.85 : 1,
          display: "flex",
          alignItems: "center",
          gap: "7px",
          transition: "background 0.15s, opacity 0.15s",
          whiteSpace: "nowrap",
          width: isMobile ? "100%" : "auto",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          if (!isAdding)
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--accent-hover)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "var(--accent)";
        }}
      >
        {isAdding ? (
          <Spinner size={13} color="#fff" />
        ) : (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        )}
        {isAdding ? t("dashboard.adding") : t("dashboard.addApplication")}
      </button>
    </div>
  );
};
