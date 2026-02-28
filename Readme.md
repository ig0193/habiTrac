# habiTrac

Habit tracker where people can sign up with a private user ID, add habits, check in daily, and see how others are doing.

## What it does

- Sign up with a secret user ID + display name (no passwords)
- Log in with just your user ID
- Add habits with icons, check in daily
- View weekly progress and full check-in history (calendar heatmap)
- Browse and search community members and their habits

## Tech stack

- **Frontend:** React + TypeScript + Tailwind CSS (Vite)
- **Backend:** Python FastAPI (async)
- **Database:** MongoDB Atlas (via Motor async driver)

## Run locally

**1. Set up MongoDB:**

Copy the env template and fill in your Atlas connection string:

```
cd backend
cp .env.example .env
# edit .env with your MongoDB URI
```

**2. Backend** (port 8000):

```
cd backend
pip3 install -r requirements.txt
python3 -m uvicorn main:app --reload --port 8000
```

Seeds demo data on first run if the DB is empty.

**3. Frontend** (port 5173, proxies `/api` to backend):

```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Project structure

```
backend/
  main.py           - FastAPI app, CORS, routers, lifespan seed
  models.py         - Pydantic request/response models
  database.py       - Motor client, collection accessors
  store.py          - Async data access layer (MongoDB queries)
  .env              - MongoDB URI (not committed)
  routes/
    auth.py         - /api/join, /api/login, /api/users
    habits.py       - /api/habits CRUD
    checkins.py     - /api/habits/:id/checkin(s)
    community.py    - /api/community, /api/stats

frontend/src/
  api.ts            - Fetch-based API client
  types.ts          - Shared TypeScript types
  context/          - React context (user, navigation)
  components/       - All UI components
```

## Goals

- [x] UI
- [x] Backend server
- [x] Persistent storage (MongoDB Atlas)
- [ ] Deployment
- [ ] Real users
