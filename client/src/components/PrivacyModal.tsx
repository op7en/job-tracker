import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: `
      linear-gradient(
        145deg,
        var(--bg-modal) 0%,
        var(--bg-modal-elevated, var(--bg-modal)) 100%
      )
    `,
          borderRadius: "12px",
          maxWidth: "520px",
          width: "100%",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: `
      0 20px 40px -8px rgba(0, 0, 0, 0.25),
      0 8px 16px -6px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(0, 0, 0, 0.05)
    `,
          border: "1px solid var(--border-modal)",
          outline: "1px solid rgba(0, 0, 0, 0.03)",
          outlineOffset: "1px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              {t("privacy.title")}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                fontSize: "28px",
                cursor: "pointer",
                padding: 0,
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-hover)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              ×
            </button>
          </div>
        </div>

        <div
          style={{
            padding: "24px",
            overflowY: "auto",
            fontSize: "14px",
            color: "var(--text-primary)",
            lineHeight: "1.7",
          }}
        >
          <p style={{ marginTop: 0, marginBottom: "16px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              {t("privacy.data")}
            </strong>{" "}
            <span style={{ color: "var(--text-primary)", opacity: 0.9 }}>
              {t("privacy.dataText")}
            </span>
          </p>

          <p style={{ marginBottom: "16px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              {t("privacy.access")}
            </strong>{" "}
            <span style={{ color: "var(--text-primary)", opacity: 0.9 }}>
              {t("privacy.accessText")}
            </span>
          </p>

          <p style={{ marginBottom: "16px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              {t("privacy.confidentiality")}
            </strong>{" "}
            <span style={{ color: "var(--text-primary)", opacity: 0.9 }}>
              {t("privacy.confidentialityText")}
            </span>
          </p>

          <p style={{ marginBottom: "16px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              {t("privacy.deletion")}
            </strong>{" "}
            <span style={{ color: "var(--text-primary)", opacity: 0.9 }}>
              {t("privacy.deletionText")}
            </span>
          </p>

          <div
            style={{
              background: "var(--bg-input)",
              padding: "16px",
              borderRadius: "8px",
              marginTop: "20px",
              marginBottom: "20px",
              border: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontWeight: 600,
                color: "var(--text-primary)",
                fontSize: "15px",
              }}
            >
              {t("privacy.contact")}
            </p>
            <p
              style={{ margin: 0, color: "var(--text-primary)", opacity: 0.95 }}
            >
              <span style={{ fontWeight: 500 }}>
                {t("privacy.adminEmail")}:
              </span>{" "}
              <a
                href="mailto:perevalovoleg77@gmail.com"
                style={{
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontWeight: 500,
                  borderBottom: "1px solid var(--accent)",
                }}
              >
                perevalovoleg77@gmail.com
              </a>
            </p>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: "13px",
                color: "var(--text-primary)",
                opacity: 0.8,
              }}
            >
              {t("privacy.contactNote")}
            </p>
          </div>

          <p
            style={{
              marginTop: "20px",
              fontSize: "13px",
              color: "var(--text-primary)",
              opacity: 0.7,
              fontStyle: "italic",
            }}
          >
            {t("privacy.acceptConfirm")}
          </p>
        </div>

        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <Button
            variant="secondary"
            onClick={onClose}
            style={{ width: "auto", minWidth: "100px" }}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onAccept();
              onClose();
            }}
            style={{ width: "auto", minWidth: "100px" }}
          >
            {t("privacy.accept")}
          </Button>
        </div>
      </div>
    </div>
  );
};
