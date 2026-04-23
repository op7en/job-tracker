# Job Tracker

![Demo](./client/public/demo.gif)

A job application tracker that behaves like a lightweight ATS.

Instead of just storing applications, it helps you understand your hiring pipeline, track progress, and take action when things stall.

🔗 **[Live Demo](https://job-tracker-xi-lake.vercel.app)**

---

## Why this exists

Most job trackers are simple lists.
They do not show what is actually happening with your applications.

This project focuses on **process visibility and decision-making**:

- Visual pipeline instead of a static list
- Activity history for every application
- Detection of stalled applications
- Basic analytics to understand outcomes

---

## Core Features

### Pipeline (Kanban View)

Visualize your applications across stages and move them with drag & drop.

### Activity Tracking

Every change is recorded: status updates, edits, and timeline per application.

### Stale Detection

Applications with no response for 7+ days are highlighted, helping you decide when to follow up or move on.

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

I use this app to track my own job search:

- monitor response rate
- detect stalled applications
- track interview progress

---

## Tech Stack

| Layer        | Technologies                                                         |
| ------------ | -------------------------------------------------------------------- |
| Frontend     | React, TypeScript, Vite, React Router, react-i18next, react-toastify |
| Backend      | Node.js, Express, TypeScript, PostgreSQL                             |
| Auth         | JWT, bcrypt                                                          |
| Architecture | Controllers / Services / Repositories                                |
| Deploy       | Vercel (frontend) · Railway (backend + database)                     |

---

## Project Structure

```text
job-tracker/
├── client/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── context/
│       ├── i18n/
│       └── pages/
└── src/
    ├── config/
    ├── controllers/
    ├── services/
    ├── repositories/
    └── middleware/
```

---

## Getting Started

### Backend

```bash
cd job-tracker
npm install
npm run dev
```

### Frontend

```bash
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

---

## Notes

- Built with focus on product thinking, not just CRUD
- Designed to simulate a simplified ATS workflow

---

> Italian language support was added as a personal tribute to my aunt, who has lived in Italy since 2000.

[Читать на русском](README.ru.md)
