# Job Tracker

A fullstack web application for tracking job applications during your job search.

🔗 **[Live Demo](https://job-tracker-xi-lake.vercel.app)**

## Features

- JWT authentication (register / login / logout)
- Add, update and delete job applications
- Track status: Applied → Interview → Offer / Rejected
- Dark and light theme with persistence
- 3 languages: English, Russian, Italian
- Responsive — table on desktop, cards on mobile
- Skeleton loading states, toast notifications

> Italian was added as a personal tribute to my aunt who has lived in Italy since 2000 and helped fund this project's hosting.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, TypeScript, Vite, React Router, react-i18next, react-toastify |
| Backend | Node.js, Express, TypeScript, PostgreSQL, JWT, bcrypt |
| Deploy | Vercel (frontend) · Railway (backend + database) |

## Project Structure

job-tracker/
├── client/                 # Frontend (React + TypeScript)
│   └── src/
│       ├── api/            # Axios instance
│       ├── components/
│       │   └── dashboard/  # DesktopTable, MobileCards, StatsStrip, AddApplicationForm
│       ├── context/        # ThemeContext
│       ├── hooks/          # useApplications
│       ├── i18n/           # Translations (en, ru, it)
│       └── pages/          # Login, Register, Dashboard
└── src/                    # Backend (Express + TypeScript)
├── routes/             # auth, applications
├── middleware/         # JWT auth
└── index.ts


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

PORT=3000
JWT_SECRET=your_secret
DATABASE_URL=your_postgresql_url


---

[Читать на русском](README.ru.md)
