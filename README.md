# Realtime App (NestJS + React + WebSockets + JWT)

## Quickstart

### 1) Database (Postgres)
Option A: Docker
```bash
docker run --name pg-nest-react -e POSTGRES_PASSWORD=postgres   -e POSTGRES_USER=postgres -e POSTGRES_DB=appdb -p 5432:5432 -d postgres:15
```

### 2) Backend
```bash
cd backend
pnpm install
pnpm prisma:migrate
pnpm start:dev
```

> Configure `.env` in `backend/.env` if needed.

### 3) Frontend
```bash
cd ../frontend
pnpm install
pnpm dev
```

Open http://localhost:5173

- Register a user on `/login`, then Sign in.
- Create an item via REST:
```bash
# replace <TOKEN> with your JWT from login response (network tab)
curl -X POST http://localhost:3000/items   -H "Authorization: Bearer <TOKEN>"   -H "Content-Type: application/json"   -d '{"name":"Dot"}'
```
- Open two browser windows; drag the green dot in one and watch the other update live.


### Schema change: rectangle defaults
After pulling this version, run:
```
cd backend
pnpm prisma:migrate
```
Items are stored as rectangles by default with fields: shape=RECT, width=120, height=80.
