# Job Tracker

Fullstack веб-приложение для отслеживания откликов на вакансии — сделано как реальный продукт, а не учебный проект.

🔗 **[Live Demo](https://job-tracker-xi-lake.vercel.app)**

## Возможности

- JWT аутентификация (регистрация / вход / выход) с валидацией env при старте
- Добавление, редактирование, удаление заявок
- **Канбан-доска** с drag & drop для смены статусов
- **Таблица** для управления данными — переключение между видами
- **Лог активности** — история каждого изменения статуса и редактирования
- **Stale detection** — подсветка заявок без ответа 7+ дней
- Статистика: всего, собеседования, офферы, отказы, процент отклика
- Оптимистичный UI с отменой удаления (5 секунд)
- Тёмная / светлая тема с сохранением
- 3 языка: английский, русский, итальянский
- Адаптив — Канбан + карточки на мобильном, таблица на десктопе
- Skeleton-загрузка, toast-уведомления

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | React, TypeScript, Vite, React Router, react-i18next, react-toastify |
| Backend | Node.js, Express, TypeScript, PostgreSQL, JWT, bcrypt |
| Архитектура | Controllers / Services / Repositories |
| Деплой | Vercel (frontend) · Railway (backend + база данных) |

## Структура проекта

```
job-tracker/
├── client/                 # Frontend (React + TypeScript)
│   └── src/
│       ├── api/            # Axios instance
│       ├── components/
│       │   └── dashboard/  # KanbanBoard, DesktopTable, MobileCards,
│       │                   # StatsStrip, ActivityModal, AddApplicationForm
│       ├── context/        # ThemeContext
│       ├── hooks/          # useApplications (оптимистичные обновления)
│       ├── i18n/           # Переводы (en, ru, it)
│       └── pages/          # Login, Register, Dashboard
└── src/                    # Backend (Express + TypeScript)
├── config/             # Валидация env (JWT_SECRET)
├── controllers/        # HTTP слой
├── services/           # Бизнес-логика
├── repositories/       # Запросы к БД
├── middleware/         # JWT auth
└── index.ts
```

## Запуск локально

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

```
PORT=3000
JWT_SECRET=your_secret
DATABASE_URL=your_postgresql_url
FRONTEND_URL=http://localhost:5173
```

---

> Итальянский язык добавлен в знак уважения к тёте, которая живёт в Италии с 2000 года.

[Read in English](README.md)
