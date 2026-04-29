import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { PrivacyConsent } from "../components/PrivacyConsent";
import { PrivacyModal } from "../components/PrivacyModal";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { AuthLayout } from "../components/AuthLayout";
import { useApiWarmup } from "../hooks/useApiWarmup";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isWarmingUp, warmupFailed } = useApiWarmup();

  const {
    email,
    setEmail,
    password,
    setPassword,
    agreed,
    setAgreed,
    loading,
    handleSubmit,
  } = useRegisterForm();
  const submitDisabled = loading || isWarmingUp;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !submitDisabled) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <AuthLayout variant="register">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Input
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <Input
            type="password"
            placeholder={t("auth.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <PrivacyConsent
            checked={agreed}
            onChange={setAgreed}
            onViewPolicy={() => setIsModalOpen(true)}
          />

          <Button
            onClick={handleSubmit}
            disabled={submitDisabled}
            loading={loading || isWarmingUp}
            loadingText={
              isWarmingUp ? t("auth.connectingServer") : t("auth.creating")
            }
            style={{ marginTop: "4px" }}
          >
            {t("auth.createAccount")}
          </Button>
          {(isWarmingUp || warmupFailed) && (
            <p
              role="status"
              aria-live="polite"
              style={{
                marginTop: "2px",
                fontSize: "12px",
                color: warmupFailed
                  ? "var(--danger)"
                  : "var(--text-secondary)",
                minHeight: "18px",
              }}
            >
              {isWarmingUp
                ? t("auth.serverWarmingUp")
                : t("auth.serverUnavailableShort")}
            </p>
          )}
        </div>

        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "13px",
            color: "var(--text-secondary)",
          }}
        >
          {t("auth.alreadyHaveAccount")}{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "var(--accent)", cursor: "pointer" }}
          >
            {t("auth.signInLink")}
          </span>
        </p>
      </AuthLayout>

      <PrivacyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccept={() => setAgreed(true)}
      />
    </>
  );
};

export default Register;
