# Job Tracker

A fullstack web application for tracking job applications — built as a real product, not a tutorial project.

🔗 **[Live Demo](https://job-tracker-xi-lake.vercel.app)**

## Features

- JWT authentication (register / login / logout) with fail-fast env validation
- Add, edit, delete job applications
- **Kanban board** with drag & drop status changes
- **Table view** for data management — switch between views
- **Activity log** — timeline of every status change and edit per application
- **Stale detection** — highlights applications with no response for 7+ days
- Stats strip: total, interviews, offers, rejections, response rate
- Optimistic UI with undo delete (5s window)
- Dark / light theme with persistence
- 3 languages: English, Russian, Italian
- Responsive — Kanban + cards on mobile, table on desktop
- Skeleton loading states, toast notifications

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, TypeScript, Vite, React Router, react-i18next, react-toastify |
| Backend | Node.js, Express, TypeScript, PostgreSQL, JWT, bcrypt |
| Architecture | Controllers / Services / Repositories pattern |
| Deploy | Vercel (frontend) · Railway (backend + database) |

## Project Structure

```
job-tracker/
├── client/                 # Frontend (React + TypeScript)
│   └── src/
│       ├── api/            # Axios instance
│       ├── components/
│       │   └── dashboard/  # KanbanBoard, DesktopTable, MobileCards,
│       │                   # StatsStrip, ActivityModal, AddApplicationForm
│       ├── context/        # ThemeContext
│       ├── hooks/          # useApplications (optimistic updates)
│       ├── i18n/           # Translations (en, ru, it)
│       └── pages/          # Login, Register, Dashboard
└── src/                    # Backend (Express + TypeScript)
├── config/             # env validation (JWT_SECRET)
├── controllers/        # HTTP layer
├── services/           # Business logic
├── repositories/       # Database queries
├── middleware/         # JWT auth
└── index.ts
```

## Getting Started

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

**Environment variables**

```
PORT=3000
JWT_SECRET=your_secret
DATABASE_URL=your_postgresql_url
FRONTEND_URL=http://localhost:5173
```

---

> Italian was added as a personal tribute to my aunt who has lived in Italy since 2000.

[Читать на русском](README.ru.md)
