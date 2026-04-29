import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import { getRegisterErrorMessageKey } from "../utils/authErrorMessages";

interface UseRegisterFormReturn {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  agreed: boolean;
  setAgreed: (value: boolean) => void;
  loading: boolean;
  handleSubmit: () => Promise<void>;
  validateForm: () => boolean;
}

export const useRegisterForm = (): UseRegisterFormReturn => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      toast.warning(t("auth.fillAllFields"));
      return false;
    }

    if (!emailRegex.test(trimmedEmail)) {
      toast.warning(t("auth.invalidEmail"));
      return false;
    }

    if (password.length < 6) {
      toast.warning(t("auth.passwordTooShort"));
      return false;
    }

    if (!agreed) {
      toast.warning(t("auth.mustAgree"));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (loading) return;
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post("/auth/register", {
        email: email.trim(),
        password,
      });
      toast.success(t("auth.accountCreated"));
      navigate("/login");
    } catch (err) {
      toast.error(t(getRegisterErrorMessageKey(err)));
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    agreed,
    setAgreed,
    loading,
    handleSubmit,
    validateForm,
  };
};
