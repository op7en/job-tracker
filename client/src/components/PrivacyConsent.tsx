import React from "react";
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
}) => (
  <div style={{ marginTop: "8px", marginBottom: "4px" }}>
    <Checkbox
      checked={checked}
      onChange={onChange}
      label={
        <>
          I agree to the{" "}
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
            privacy policy
          </button>
          <br />
          <span style={{ fontSize: "12px", opacity: 0.7 }}>
            For account deletion or questions:{" "}
            <span style={{ fontFamily: "monospace" }}>{contactEmail}</span>
          </span>
        </>
      }
    />
  </div>
);
