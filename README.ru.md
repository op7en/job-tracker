# Job Tracker

Fullstack-приложение для отслеживания откликов на вакансии.

🔗 **[Открыть](https://job-tracker-xi-lake.vercel.app)**

## Возможности

- JWT-аутентификация (регистрация / вход / выход)
- Добавление, обновление и удаление откликов
- Статусы: Отправлен → Интервью → Оффер / Отказ
- Тёмная и светлая тема с сохранением
- 3 языка: английский, русский, итальянский
- Адаптив — таблица на десктопе, карточки на мобиле
- Skeleton-загрузка, toast-уведомления

> Итальянский добавлен в память о тёте, которая живёт в Италии с 2000 года и помогла оплатить хостинг для этого проекта.

## Стек

| Слой | Технологии |
|------|-----------|
| Frontend | React, TypeScript, Vite, React Router, react-i18next, react-toastify |
| Backend | Node.js, Express, TypeScript, PostgreSQL, JWT, bcrypt |
| Деплой | Vercel (frontend) · Railway (backend + база данных) |

## Структура проекта
```
job-tracker/
├── client/                 # Frontend (React + TypeScript)
│   └── src/
│       ├── api/            # Axios instance
│       ├── components/
│       │   └── dashboard/  # DesktopTable, MobileCards, StatsStrip, AddApplicationForm
│       ├── context/        # ThemeContext
│       ├── hooks/          # useApplications
│       ├── i18n/           # Переводы (en, ru, it)
│       └── pages/          # Login, Register, Dashboard
└── src/                    # Backend (Express + TypeScript)
├── routes/             # auth, applications
├── middleware/         # JWT auth
└── index.ts
```

## Запуск

**Backend**
```bash
cd job-tracker
npm install
npm run dev
```

**Frontend**
```bash
cd client
npm install
npm run dev
```

**Переменные окружения**

PORT=3000
JWT_SECRET=your_secret
DATABASE_URL=your_postgresql_url

---

[Read in English](README.md)

