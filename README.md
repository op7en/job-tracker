# Job Tracker

Personal job application tracker. I built it because my spreadsheet was
turning into a mess: too many companies, too many status changes, and no
easy way to see where I should follow up.

[Live demo](https://job-tracker-xi-lake.vercel.app) · [README на русском](README.ru.md)

![demo](./client/public/demo.gif)

## Stack

- **Frontend:** React 19, TypeScript, Vite, React Router, TanStack Query, react-i18next
- **Backend:** Node.js, Express 5, TypeScript, PostgreSQL (`pg`), Zod, JWT, bcryptjs
- **Tests:** Vitest + Supertest for backend services and HTTP routes
- **CI:** GitHub Actions
- **Deploy:** Vercel for the frontend, Railway for the backend and Postgres

## Run locally

```bash
git clone https://github.com/op7en/job-tracker.git
cd job-tracker
cp .env.example .env
```

Fill `JWT_SECRET` and `DATABASE_URL`, then start the backend:

```bash
npm install
npm run migrate
npm run dev
```

In another terminal:

```bash
cd client
npm install
npm run dev
```

Backend runs on `:3000`, frontend runs on `:5173`.

Useful commands:

```bash
npm run build
npm test

cd client
npm run lint
npm run build
```

`JWT_SECRET` must be a long random string. In production the backend refuses
to start with a weak secret.

For production Postgres SSL: if `DATABASE_URL` contains `sslmode=require`,
the app expects a valid certificate chain. Set `DATABASE_CA_CERT` when your
provider needs a custom CA, or use a private database URL that does not force
SSL.

## What it does

- Kanban board with drag-and-drop between `applied`, `interview`, `offer`,
  and `rejected`
- Table view for editing, filtering, and deleting applications
- Activity log per application
- 7-day stale flag for applications that did not move
- Basic stats: total applications, interviews, offers, rejections, response rate
- English, Russian, and Italian UI

## Backend structure

The backend is split into `routes -> controllers -> services -> repositories`.

That is not magic architecture. Some read methods still pass through the
service layer without adding much. I kept the shape because writes do need a
service layer: create/update operations open a transaction and write the
application change and the `activity_logs` row together.

Application reads, updates, and deletes are scoped by `user_id` in SQL. The
activity log endpoint checks ownership through a join with `applications`.
That is the main access-control line in this project.

Dynamic application updates are built in the repository, not in the service.
The repository only allows a small whitelist of columns (`company`, `position`,
`status`, `notes`), so user input never becomes a column name.

## Auth

- Access token: 15 minutes, kept in memory on the client, sent as
  `Authorization: Bearer`.
- Refresh token: 30 days, sent as an `httpOnly` cookie scoped to `/auth`.
- Refresh tokens are stored in PostgreSQL as SHA-256 hashes. This is not used
  for passwords; the token itself is generated from 48 random bytes.
- Every `/auth/refresh` revokes the old refresh token and issues a new pair.
- Refresh tokens have a `family_id`. If a revoked token is reused, the whole
  family is revoked.
- Login still runs `bcrypt.compare` against a dummy hash when the email does
  not exist, so timing does not reveal which emails are registered.
- The frontend uses one shared refresh promise, so several concurrent `401`
  responses do not trigger several refresh requests.

I also had to deal with a real deployment bug around rate limiting. Railway
sits behind a proxy, so Express needs `app.set("trust proxy", 1)` or the
limiter sees the proxy address instead of the real client. `express-rate-limit`
also needed `ipKeyGenerator` for safer IPv6 handling.

## Database

PostgreSQL, 5 forward-only migrations:

- `users` - accounts, unique email
- `applications` - job applications, linked to `users`
- `activity_logs` - timeline entries with JSONB payloads, cascades from
  `applications`
- `refresh_tokens` - refresh sessions stored as hashes, with `family_id`
- `schema_migrations` - tracks applied migration files

Constraints that matter:

- `applications.status` has a database `CHECK`
- `applications.user_id` cascades from `users`
- `activity_logs.application_id` cascades from `applications`
- `applications.user_id`, `refresh_tokens.user_id`, `refresh_tokens.expires_at`,
  and `refresh_tokens.family_id` are indexed

I wrote a small migration runner to learn how migration tracking works:
`schema_migrations`, per-file transaction, and a Postgres advisory lock. It has
no down migrations and no checksums. For a team project I would use `dbmate`,
`node-pg-migrate`, or a framework migration tool instead.

## Testing and CI

Backend tests cover service logic and HTTP routes:

- register/login/refresh/logout
- refresh-token rotation and family revocation
- dummy bcrypt compare for non-existing login emails
- application create/update transactions with rollback behavior
- `/auth/me` authorization cases

GitHub Actions runs backend build + tests and frontend lint + build on pull
requests and pushes to `main`.

Frontend tests are not written yet.

## What is still missing

I know about these gaps:

- `GET /applications` has no pagination.
- `activity_logs` grows forever.
- Expired and revoked refresh tokens are not cleaned up by a cron job.
- There is no email verification and no password reset flow.
- Rate limiting is IP-based, so shared NAT can block real users.
- Kanban drag-and-drop has weak keyboard accessibility.
- The 7-day stale check is calculated on the client.
- Error logging is still `console.error`; there is no pino/request-id setup.
- Frontend has no tests.

These are not hidden. They are the next obvious steps if this project keeps
growing.
