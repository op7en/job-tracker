# Job Tracker

![Demo](./client/public/demo.gif)

A job application tracker designed as a lightweight ATS.

Instead of just storing applications, it helps you understand your hiring pipeline, track progress, and take action when things stall.

🔗 **[Live Demo](https://job-tracker-xi-lake.vercel.app)**

---

## Why this exists

Most job trackers are simple lists.
They don't show what's actually happening with your applications.

This project focuses on **process visibility and decision-making**:

- Visual pipeline instead of static lists
- Activity history for every application
- Detection of stalled applications
- Basic analytics to understand outcomes

---

## Features

### Pipeline (Kanban Board)

Visualize applications across stages and move them via drag & drop.

### Activity Log

Every change is recorded: status updates, edits, and full timeline per application.

### Stale Detection

Applications with no response for 7+ days are highlighted — helping decide when to follow up or move on.

### Insights

Quick overview of total applications, interviews, offers, rejections, and response rate.

### Dual View

- **Table** → precise control, filtering, editing
- **Board** → process visualization

---

## Screenshots

### Kanban

![Kanban](./client/public/kanban.png)

### Mobile

![Mobile](./client/public/mobile.png)

### Table

![Table](./client/public/table.png)

### History

![History](./client/public/history.gif)

---

## Real Usage

This app is used to track my own job search: monitoring response rate, identifying stalled applications, and tracking interview progress.

---

## Tech Stack

| Layer        | Technologies                                                           |
| ------------ | ---------------------------------------------------------------------- |
| Frontend     | React, TypeScript, Vite, React Router, react-i18next, react-toastify   |
| Backend      | Node.js, Express, TypeScript, PostgreSQL                               |
| Auth         | JWT access tokens · Refresh token rotation · httpOnly cookies · bcrypt |
| Architecture | Controllers / Services / Repositories                                  |
| Deployment   | Vercel (frontend) · Railway (backend + database)                       |

---

## Auth Architecture

- **Access token** — short-lived JWT (15 min), stored in memory, sent via `Authorization: Bearer`
- **Refresh token** — long-lived (30 days), stored as SHA-256 hash in PostgreSQL, sent via `httpOnly` cookie scoped to `/auth`
- **Token rotation** — every refresh invalidates the old token and issues a new one; reuse of a revoked token is rejected immediately
- **Silent refresh** — Axios interceptor automatically refreshes the access token on 401 and retries the original request; concurrent 401s share a single refresh promise to avoid race conditions

---

## Project Structure

```text
job-tracker/
├── client/
│   └── src/
│       ├── api/           # Axios instance + interceptors
│       ├── components/
│       ├── hooks/
│       ├── context/
│       ├── i18n/
│       └── pages/
└── src/
    ├── config/
    ├── controllers/       # HTTP layer
    ├── services/          # Business logic
    ├── repositories/      # Database access
    └── middleware/
```

---

## Local Setup

```bash
# 1. Backend
cd job-tracker
npm install
npm run migrate
npm run dev

# 2. Frontend (new terminal)
cd client
npm install
npm run dev
```

### Environment Variables

```env
PORT=3000
JWT_SECRET=your_secret
DATABASE_URL=your_postgresql_url
FRONTEND_URL=http://localhost:5173
```

### Health & Readiness

- `GET /health` — basic process check
- `GET /ready` — readiness check with database ping (`SELECT 1`)

### Migrations

SQL migrations live in `./migrations` and are tracked in `schema_migrations`.

```bash
npm run migrate
```

---

## Notes

- Built with product thinking, not just CRUD
- Layered architecture separates HTTP concerns from business logic and data access
- Designed to simulate a simplified ATS workflow

---

[Читать на русском](README.ru.md)
