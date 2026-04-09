import React from "react";
import { Button } from "./ui/Button";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)", // Затемнение сильнее для лучшего контраста
        backdropFilter: "blur(4px)", // Размытие фона
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: `
      linear-gradient(
        145deg,
        var(--bg-modal) 0%,
        var(--bg-modal-elevated, var(--bg-modal)) 100%
      )
    `,
          borderRadius: "12px",
          maxWidth: "520px",
          width: "100%",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: `
      0 20px 40px -8px rgba(0, 0, 0, 0.25),
      0 8px 16px -6px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(0, 0, 0, 0.05)
    `,
          border: "1px solid var(--border-modal)",
          outline: "1px solid rgba(0, 0, 0, 0.03)",
          outlineOffset: "1px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: "18px", // Увеличил шрифт
                fontWeight: 600, // Жирнее
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Политика конфиденциальности
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                fontSize: "28px", // Больше размер
                cursor: "pointer",
                padding: 0,
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-hover)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "24px", // Больше отступы
            overflowY: "auto",
            fontSize: "14px", // Увеличил шрифт
            color: "var(--text-primary)", // Основной цвет текста, не secondary
            lineHeight: "1.7", // Больше межстрочный интервал
          }}
        >
          <p style={{ marginTop: 0, marginBottom: "16px" }}>
            <strong
              style={{
                color: "var(--text-primary)",
                fontWeight: 600,
              }}
            >
              1. Данные.
            </strong>{" "}
            <span style={{ color: "var(--text-primary)", opacity: 0.9 }}>
              Мы собираем только ваш email, который вы указываете при
              регистрации.
            </span>
          </p>

          <p style={{ marginBottom: "16px" }}>
            <strong
              style={{
                color: "var(--text-primary)",
                fontWeight: 600,
              }}
            >
              2. Доступ.
            </strong>{" "}
            <span style={{ color: "var(--text-primary)", opacity: 0.9 }}>
              Разработчик (владелец базы данных) технически имеет доступ к
              списку email-адресов. Это необходимо для администрирования сервера
              и восстановления доступа по запросу.
            </span>
          </p>

          <p style={{ marginBottom: "16px" }}>
            <strong
              style={{
                color: "var(--text-primary)",
                fontWeight: 600,
              }}
            >
              3. Конфиденциальность.
            </strong>{" "}
            <span style={{ color: "var(--text-primary)", opacity: 0.9 }}>
              Ваш email не будет передан третьим лицам, не будет продан
              рекламодателям и не будет использован для маркетинговых рассылок.
            </span>
          </p>

          <p style={{ marginBottom: "16px" }}>
            <strong
              style={{
                color: "var(--text-primary)",
                fontWeight: 600,
              }}
            >
              4. Удаление аккаунта.
            </strong>{" "}
            <span style={{ color: "var(--text-primary)", opacity: 0.9 }}>
              Вы можете удалить свой аккаунт, отправив запрос на почту
              администратора.
            </span>
          </p>

          {/* Contact block */}
          <div
            style={{
              background: "var(--bg-input)", // Более контрастный фон
              padding: "16px",
              borderRadius: "8px",
              marginTop: "20px",
              marginBottom: "20px",
              border: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontWeight: 600,
                color: "var(--text-primary)",
                fontSize: "15px",
              }}
            >
              📧 Контакты для связи
            </p>
            <p
              style={{ margin: 0, color: "var(--text-primary)", opacity: 0.95 }}
            >
              <span style={{ fontWeight: 500 }}>Email администратора:</span>{" "}
              <a
                href="mailto:perevalovoleg77@gmail.com"
                style={{
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontWeight: 500,
                  borderBottom: "1px solid var(--accent)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                perevalovoleg77@gmail.com
              </a>
            </p>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: "13px",
                color: "var(--text-primary)",
                opacity: 0.8,
              }}
            >
              По этому адресу вы можете отправить запрос на удаление аккаунта,
              задать вопросы или сообщить о проблеме.
            </p>
          </div>

          <p
            style={{
              marginTop: "20px",
              fontSize: "13px",
              color: "var(--text-primary)",
              opacity: 0.7,
              fontStyle: "italic",
            }}
          >
            Используя сервис, вы подтверждаете, что ознакомлены и согласны с
            данными условиями.
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <Button
            variant="secondary"
            onClick={onClose}
            style={{ width: "auto", minWidth: "100px" }}
          >
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onAccept();
              onClose();
            }}
            style={{ width: "auto", minWidth: "100px" }}
          >
            Принимаю
          </Button>
        </div>
      </div>
    </div>
  );
};
