import React from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "./ui/Checkbox";

interface PrivacyConsentProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  onViewPolicy: () => void;
  contactEmail?: string;
}

export const PrivacyConsent: React.FC<PrivacyConsentProps> = ({
  checked,
  onChange,
  onViewPolicy,
  contactEmail = "perevalovoleg77@gmail.com",
}) => {
  const { t } = useTranslation();

  return (
    <div style={{ marginTop: "8px", marginBottom: "4px" }}>
      <Checkbox
        checked={checked}
        onChange={onChange}
        label={
          <>
            {t("auth.agreePrivacy")}{" "}
            <button
              type="button"
              onClick={onViewPolicy}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                color: "var(--accent)",
                fontSize: "13px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {t("auth.privacyPolicy")}
            </button>
            <br />
            <span style={{ fontSize: "12px", opacity: 0.7 }}>
              {t("auth.contactForDeletion")}{" "}
              <span style={{ fontFamily: "monospace" }}>{contactEmail}</span>
            </span>
          </>
        }
      />
    </div>
  );
};
