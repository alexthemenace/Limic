# Limic
Your AI Clone

## Ditto — Your Digital Twin

> *"The only person who can help you as well as 'You' can."*

Ditto is a Digital Twin app that lives in the front of your life — not just the background of your computer. It learns how you think and acts as your Advanced Delegate.

### Features

#### 🪞 The Mirror (Onboarding)
Train Ditto through a conversational interface. Talk about your goals, frustrations, and preferences. Connect integrations (Gmail, Calendar, Notes, Canvas) so Ditto can passively absorb your patterns without manual setup.

#### ⚡ The Delegate (Action Layer)
- **Draft as Me** — Write emails in your exact voice, tone, and vocabulary
- **Research for Me** — Filter the internet through your specific taste, not generic Top-10 lists

#### 🛡️ The Buffer (Social Layer)
- **The Gatekeeper** — Ditto reads messages first, gives you a 2-sentence summary, and offers 3 response chips written in your voice
- **The Negotiator** — Handles back-and-forth logistics and only pings you when a final decision is made

---

## Local Setup

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### 1 — Backend (API server)

```bash
cd server

# Install dependencies
npm install

# Copy and edit environment variables
cp .env.example .env
# Edit .env — set a strong JWT_SECRET before running in production

# Run database migrations (creates SQLite dev.db)
npm run db:migrate

# Start the dev server (hot-reload via tsx watch)
npm run dev
# → API running at http://localhost:3001
```

The API is versioned under `/api/v1`. A health check is available at `GET /health`.

### 2 — Frontend

```bash
cd ditto
npm install
npm run dev
# → UI running at http://localhost:5173
```

---

## Environment Variables

All variables live in `server/.env` (copy from `server/.env.example`).

| Variable       | Default                     | Description                                |
| -------------- | --------------------------- | ------------------------------------------ |
| `PORT`         | `3001`                      | Port the API server listens on             |
| `DATABASE_URL` | `file:./dev.db`             | Prisma SQLite connection string            |
| `JWT_SECRET`   | *(required in production)*  | Secret used to sign JWT tokens             |
| `CORS_ORIGIN`  | `http://localhost:5173`     | Allowed CORS origin for the frontend       |

---

## Database Migrations

Ditto uses [Prisma](https://www.prisma.io/) with SQLite.

```bash
cd server

# Create + apply a new migration during development
npm run db:migrate

# Apply existing migrations in production (no interactive prompts)
npm run db:migrate:prod

# Open Prisma Studio (visual DB browser)
npm run db:studio
```

Migration files live in `server/prisma/migrations/` and are committed to version control.

---

## Running Tests

```bash
cd server
npm test
```

Tests use [Vitest](https://vitest.dev/) + [Supertest](https://github.com/ladjs/supertest) and run against an isolated in-memory SQLite database — no setup required.

---

## API Overview

| Method   | Path                                  | Auth | Description                          |
| -------- | ------------------------------------- | ---- | ------------------------------------ |
| `GET`    | `/health`                             | ❌   | Health check                         |
| `POST`   | `/api/v1/auth/register`               | ❌   | Create account                       |
| `POST`   | `/api/v1/auth/login`                  | ❌   | Login, receive JWT                   |
| `GET`    | `/api/v1/auth/me`                     | ✅   | Current user profile                 |
| `GET`    | `/api/v1/traits`                      | ✅   | List behavioral traits               |
| `POST`   | `/api/v1/traits`                      | ✅   | Create a trait                       |
| `DELETE` | `/api/v1/traits/:id`                  | ✅   | Delete a trait                       |
| `GET`    | `/api/v1/sources`                     | ✅   | List data sources (auto-seeded)      |
| `PATCH`  | `/api/v1/sources/:sourceId/toggle`    | ✅   | Toggle source connection             |
| `GET`    | `/api/v1/chat`                        | ✅   | Chat message history                 |
| `POST`   | `/api/v1/chat`                        | ✅   | Post a chat message                  |
| `GET`    | `/api/v1/messages`                    | ✅   | Incoming messages                    |
| `POST`   | `/api/v1/messages/:id/summarize`      | ✅   | AI-summarize a message               |
| `PATCH`  | `/api/v1/messages/:id/dismiss`        | ✅   | Mark a message as handled            |
| `GET`    | `/api/v1/negotiations`                | ✅   | Negotiation threads                  |
| `PATCH`  | `/api/v1/negotiations/:id/resolve`    | ✅   | Resolve a negotiation                |
| `POST`   | `/api/v1/actions/draft`               | ✅   | Draft an email in your voice         |
| `POST`   | `/api/v1/actions/research`            | ✅   | Personalised research results        |

---

## Tech Stack

### Frontend (`ditto/`)
- React 19 + TypeScript
- Vite 8
- Pure CSS (design system built on CSS variables, light/dark mode)

### Backend (`server/`)
- Express 4 + TypeScript (compiled with tsup)
- Prisma ORM + SQLite
- JWT (7-day tokens) + bcryptjs password hashing
- Zod request validation
- Helmet security headers + CORS
- express-rate-limit (global: 200 req/15 min; auth: 20 req/15 min)
- Vitest + Supertest for testing

---

## Deployment

The backend is a plain Node.js HTTP server — deploy anywhere Node runs.

### Example: [Render](https://render.com)

1. Create a **Web Service** pointing at the `server/` directory.
2. Set **Build Command**: `npm install && npm run build && npm run db:migrate:prod`
3. Set **Start Command**: `npm start`
4. Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `NODE_ENV=production`.

> **Note:** For a persistent SQLite file on Render, attach a disk and set `DATABASE_URL=file:/data/prod.db`.

### Example: [Railway](https://railway.app) / [Fly.io](https://fly.io)

Both support Node deployments with similar environment variable workflows. Attach persistent storage for the SQLite file and point `DATABASE_URL` at it.
