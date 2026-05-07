# TaskFlow

Modern full-stack task manager with a React + Vite + Tailwind frontend and an Express + MongoDB backend with JWT auth.

- Frontend: React 19 + TanStack Router + Tailwind v4 (in this Lovable project — equivalent to Vite + React)
- Backend: Node.js + Express + Mongoose (`/server`)
- Database: MongoDB Atlas
- Auth: JWT + bcrypt
- Charts: Recharts
- UI: shadcn/ui + glassmorphism design system, dark/light mode

## Project structure

```
.
├── src/                # Frontend (client)
│   ├── routes/         # Pages (file-based routing)
│   ├── components/     # Reusable UI + AppSidebar, TaskDialog, ThemeToggle
│   ├── context/        # AuthContext (Context API)
│   ├── hooks/          # useTasks
│   ├── lib/api.ts      # Axios instance with JWT interceptor
│   └── styles.css      # Tailwind + design tokens
└── server/             # Backend (Express + MongoDB)
    ├── src/
    │   ├── config/db.js
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/         # User, Task
    │   ├── routes/         # /api/auth, /api/tasks
    │   └── index.js        # Entry point
    ├── .env.example
    └── package.json
```

## 1. MongoDB setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Add a database user (username + password).
3. Network Access → allow your IP (or `0.0.0.0/0` for testing).
4. Get the connection string: `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/taskflow`.

## 2. Backend setup

```bash
cd server
cp .env.example .env       # then edit .env
npm install
npm run dev                # http://localhost:5000
```

`.env` values:

```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=<long random string>
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

### REST API

| Method | Endpoint              | Auth | Body                                    |
| ------ | --------------------- | ---- | --------------------------------------- |
| POST   | `/api/auth/register`  | —    | `{ name, email, password }`             |
| POST   | `/api/auth/login`     | —    | `{ email, password }`                   |
| GET    | `/api/tasks`          | ✅   | —                                       |
| POST   | `/api/tasks`          | ✅   | `{ title, description?, priority?, status? }` |
| PUT    | `/api/tasks/:id`      | ✅   | partial task                            |
| DELETE | `/api/tasks/:id`      | ✅   | —                                       |

Auth header: `Authorization: Bearer <token>`.

## 3. Frontend setup

From the project root:

```bash
cp .env.example .env       # set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                # http://localhost:5173
```

> The frontend in this Lovable project uses TanStack Start (Vite under the hood). If you scaffold a plain Vite + React app, copy `src/` into it and install: `axios react-hook-form zod sonner recharts lucide-react @tanstack/react-router @tanstack/react-query tailwindcss`.

## 4. Features

- Register, login, logout (JWT)
- Protected routes (`/_app/*`)
- Dashboard: stat cards, 7-day activity bar chart, priority pie chart, recent activity
- Tasks: create, edit, delete, toggle complete, search, filter by status & priority, pagination
- Glass UI, dark/light theme toggle, toast notifications, loading spinners, empty states

## 5. Deployment

### Backend on Railway

1. Push `server/` to a GitHub repo (or include in monorepo with root `server`).
2. Create a Railway project → "Deploy from GitHub" → set root directory to `server`.
3. Add env vars: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_ORIGIN` (your Vercel URL).
4. Start command: `npm start`.

### Frontend on Vercel

1. Import the repo on Vercel.
2. Set env var `VITE_API_URL=https://<your-railway-app>.up.railway.app/api`.
3. Build command: `npm run build`. Output: `dist/`.

Update the backend `CLIENT_ORIGIN` to your Vercel URL once deployed.

## 6. Scripts cheat-sheet

```bash
# backend
cd server && npm install && npm run dev

# frontend
npm install && npm run dev
```

Enjoy TaskFlow ✨
