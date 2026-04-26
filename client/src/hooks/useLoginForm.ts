import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import api, { setAccessToken } from "../api/axios";

interface UseLoginFormReturn {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  loading: boolean;
  handleSubmit: () => Promise<void>;
  validateForm: () => boolean;
}

export const useLoginForm = (): UseLoginFormReturn => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !password) {
      toast.warning(t("auth.fillAllFields"));
      return false;
    }

    if (!emailRegex.test(trimmedEmail)) {
      toast.warning(t("auth.invalidEmail"));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });
      setAccessToken(res.data.accessToken);
      toast.success(t("auth.welcomeBack"));
      navigate("/dashboard");
    } catch {
      toast.error(t("auth.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit,
    validateForm,
  };
};
