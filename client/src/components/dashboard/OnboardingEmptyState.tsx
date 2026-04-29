import { useTranslation } from "react-i18next";

export const OnboardingEmptyState = () => {
  const { t } = useTranslation();

  const items = ["save", "move", "review"];

  return (
    <div
      style={{
        border: "1px dashed var(--border)",
        borderRadius: "8px",
        padding: "22px",
        background: "var(--bg-surface)",
      }}
    >
      <div
        style={{
          color: "var(--text-primary)",
          fontSize: "15px",
          fontWeight: 600,
          marginBottom: "6px",
        }}
      >
        {t("dashboard.emptyTitle")}
      </div>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "13px",
          lineHeight: 1.5,
          maxWidth: "620px",
          marginBottom: "18px",
        }}
      >
        {t("dashboard.emptySubtitle")}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "12px",
        }}
      >
        {items.map((item, index) => (
          <div
            key={item}
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: "12px",
            }}
          >
            <div
              style={{
                color: "var(--accent)",
                fontSize: "12px",
                fontWeight: 700,
                marginBottom: "7px",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
            <div
              style={{
                color: "var(--text-primary)",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "4px",
              }}
            >
              {t(`dashboard.onboarding.${item}Title`)}
            </div>
            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: "12px",
                lineHeight: 1.5,
              }}
            >
              {t(`dashboard.onboarding.${item}Text`)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
