import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthLayout } from "../components/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useLoginForm } from "../hooks/useLoginForm";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { email, setEmail, password, setPassword, loading, handleSubmit } =
    useLoginForm();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <AuthLayout variant="login">
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
        <Button
          onClick={handleSubmit}
          loading={loading}
          loadingText={t("auth.signingIn")}
          style={{ marginTop: "4px" }}
        >
          {t("auth.continue")}
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
        {t("auth.noAccount")}{" "}
        <span
          onClick={() => navigate("/register")}
          style={{ color: "var(--accent)", cursor: "pointer" }}
        >
          {t("auth.createOne")}
        </span>
      </p>
    </AuthLayout>
  );
};

export default Login;
