import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useLoginForm } from "../hooks/useLoginForm";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { email, setEmail, password, setPassword, loading, handleSubmit } =
    useLoginForm();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <AuthLayout
      title="Sign in to JobTracker"
      subtitle="Track your applications in one place"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
        <Button
          onClick={handleSubmit}
          loading={loading}
          loadingText="Signing in..."
          style={{ marginTop: "4px" }}
        >
          Continue
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
        No account?{" "}
        <span
          onClick={() => navigate("/register")}
          style={{ color: "var(--accent)", cursor: "pointer" }}
        >
          Create one
        </span>
      </p>
    </AuthLayout>
  );
};

export default Login;
