import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { PrivacyConsent } from "../components/PrivacyConsent";
import { PrivacyModal } from "../components/PrivacyModal";
import { useRegisterForm } from "../hooks/useRegisterForm";

const Register: React.FC = () => {
  const navigate = useNavigate();
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
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-app)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 24px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <ThemeToggle />
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 16px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "360px" }}>
          {/* Logo & Title */}
          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "var(--accent)",
                borderRadius: "8px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
              </svg>
            </div>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: 500,
                color: "var(--text-primary)",
                marginBottom: "4px",
              }}
            >
              Create your account
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              Start tracking your job applications
            </p>
          </div>

          {/* Form */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <Input
              type="password"
              placeholder="Password"
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
              loadingText="Creating account..."
              style={{ marginTop: "4px" }}
            >
              Create account
            </Button>
          </div>

          {/* Footer link */}
          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
              fontSize: "13px",
              color: "var(--text-secondary)",
            }}
          >
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              style={{ color: "var(--accent)", cursor: "pointer" }}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>

      {/* Modals */}
      <PrivacyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccept={() => setAgreed(true)}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Register;
