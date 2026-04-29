import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ThemeToggle";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useAuth } from "../context/useAuth";

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated, isRestoring } = useAuth();

  const primaryTarget = isAuthenticated ? "/dashboard" : "/register";
  const secondaryTarget = isAuthenticated ? "/dashboard" : "/login";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-app)" }}>
      <header
        style={{
          height: "56px",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <div
            style={{
              width: "24px",
              height: "24px",
              background: "var(--accent)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
            </svg>
          </div>
          <span
            style={{
              color: "var(--text-primary)",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            JobTracker
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "48px 24px 28px",
        }}
      >
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                color: "var(--text-primary)",
                fontSize: "42px",
                lineHeight: 1,
                fontWeight: 650,
                marginBottom: "16px",
                maxWidth: "620px",
              }}
            >
              {t("landing.title")}
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "16px",
                lineHeight: 1.6,
                maxWidth: "560px",
                marginBottom: "24px",
              }}
            >
              {t("landing.subtitle")}
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate(primaryTarget)}
                disabled={isRestoring}
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "7px",
                  padding: "10px 16px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: isRestoring ? "not-allowed" : "pointer",
                  opacity: isRestoring ? 0.7 : 1,
                }}
              >
                {isAuthenticated
                  ? t("landing.openDashboard")
                  : t("landing.primaryCta")}
              </button>
              <button
                onClick={() => navigate(secondaryTarget)}
                disabled={isRestoring}
                style={{
                  background: "transparent",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: "7px",
                  padding: "10px 16px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: isRestoring ? "not-allowed" : "pointer",
                  opacity: isRestoring ? 0.7 : 1,
                }}
              >
                {isAuthenticated
                  ? t("landing.secondaryDashboard")
                  : t("landing.secondaryCta")}
              </button>
            </div>
          </div>

          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: "8px",
              overflow: "hidden",
              background: "var(--bg-surface)",
              boxShadow: "var(--shadow)",
            }}
          >
            <img
              src="/kanban.png"
              alt="JobTracker pipeline"
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          </div>
        </section>

        <section
          style={{
            marginTop: "36px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
          }}
        >
          {["pipeline", "history", "focus"].map((item) => (
            <div
              key={item}
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: "14px",
              }}
            >
              <div
                style={{
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "5px",
                }}
              >
                {t(`landing.${item}Title`)}
              </div>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                {t(`landing.${item}Text`)}
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Landing;
