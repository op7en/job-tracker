import React from "react";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      style={{
        background: "var(--bg-input)",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        padding: "4px 8px",
        color: "var(--text-primary)",
        fontSize: "13px",
        cursor: "pointer",
        outline: "none",
      }}
    >
      <option value="en">🇺🇸 EN</option>
      <option value="ru">🇷🇺 RU</option>
      <option value="it">🇮🇹 IT</option>
    </select>
  );
};
