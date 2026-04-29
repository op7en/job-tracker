import { useTranslation } from "react-i18next";
import { Spinner } from "./dashboard/Spinner";

export const AuthRestoreScreen = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-app)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-secondary)",
        fontSize: "13px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Spinner size={14} color="var(--accent)" />
        <span>{t("auth.restoringSession")}</span>
      </div>
    </div>
  );
};
