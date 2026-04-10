import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { PrivacyConsent } from "../components/PrivacyConsent";
import { PrivacyModal } from "../components/PrivacyModal";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { AuthLayout } from "../components/AuthLayout";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
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
            loading={loading}
            loadingText={t("auth.creating")}
            style={{ marginTop: "4px" }}
          >
            {t("auth.createAccount")}
          </Button>
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
            onClick={() => navigate("/")}
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
