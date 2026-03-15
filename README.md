# PoliSight — MERN Stack Political Intelligence Dashboard

Real-time political news aggregated from **NewsData.io**, **GNews** and **Mastodon** — with MongoDB user accounts, JWT authentication, sentiment analysis, trend tracking, and a live unified timeline.

---

## Tech Stack

| Layer     | Technology                                 |
|-----------|--------------------------------------------|
| **M**     | MongoDB Atlas + Mongoose ODM               |
| **E**     | Express.js 4 (REST API, MVC pattern)       |
| **R**     | React 18 + Vite (SPA)                      |
| **N**     | Node.js 18+                                |
| Auth      | JWT (jsonwebtoken) + bcryptjs              |
| Cache     | node-cache (server) + SWR (client)         |
| Styling   | Pure CSS with design tokens (no Tailwind)  |

---

## Project Structure

```
polisight/
│
├── backend/                          ← Express + MongoDB API
│   ├── server.js                     ← Entry point
│   ├── package.json
│   ├── .env                          ← Keys (pre-filled, don't commit)
│   ├── .env.example                  ← Safe reference template
│   │
│   ├── config/
│   │   ├── db.js                     ← Mongoose connectDB()
│   │   └── cache.js                  ← Shared node-cache instance
│   │
│   ├── models/
│   │   └── User.js                   ← Mongoose schema: name, email,
│   │                                    password (bcrypt), plan,
│   │                                    preferences, savedArticles[]
│   │
│   ├── controllers/
│   │   ├── authController.js         ← register, login, getMe,
│   │   │                                updatePreferences, save/unsaveArticle
│   │   ├── newsController.js         ← NewsData.io
│   │   ├── gnewsController.js        ← GNews
│   │   ├── mastodonController.js     ← Mastodon posts + trending
│   │   └── dashboardController.js    ← Parallel aggregate + analyze
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js         ← protect (JWT required) + optionalAuth
│   │   ├── cacheMiddleware.js        ← Per-route GET response caching
│   │   └── errorHandler.js          ← Global error handler + 404
│   │
│   ├── routes/
│   │   ├── authRoutes.js             ← /api/auth/*
│   │   ├── newsRoutes.js             ← /api/news/*
│   │   ├── gnewsRoutes.js            ← /api/gnews/*
│   │   ├── mastodonRoutes.js         ← /api/mastodon/*
│   │   └── dashboardRoutes.js        ← /api/dashboard  /api/analyze
│   │
│   └── utils/
│       ├── generateToken.js          ← jwt.sign() helper
│       ├── apiClient.js              ← Axios instance (timeout + errors)
│       └── formatters.js            ← Normalise all 3 API shapes
│
└── frontend/                         ← React + Vite SPA
    ├── index.html
    ├── vite.config.js                ← Proxies /api → :5000
    ├── package.json
    ├── .env                          ← VITE_API_URL
    │
    └── src/
        ├── main.jsx
        ├── App.jsx                   ← Router + ThemeAuthBridge
        ├── index.css                 ← Full design system
        ├── App.css
        │
        ├── context/
        │   ├── AuthContext.jsx       ← Calls real /api/auth/* endpoints,
        │   │                            stores JWT in localStorage
        │   └── ThemeContext.jsx      ← Dark/light + accent, syncs to DB
        │
        ├── hooks/
        │   └── useApi.js             ← SWR fetch hook, sends Bearer token
        │
        ├── components/
        │   ├── Sidebar.jsx/.css
        │   ├── Topbar.jsx/.css
        │   └── MiniChart.jsx/.css
        │
        └── pages/
            ├── LandingPage.jsx/.css  ← Animated particle canvas hero
            ├── AuthPage.jsx/.css     ← Login + Signup (named exports)
            ├── Dashboard.jsx/.css    ← Stats, headlines, donut, sentiment
            ├── NewsPage.jsx/.css     ← NewsData + GNews with filters
            ├── MastodonPage.jsx/.css ← Social feed + trending sidebar
            ├── TrendsPage.jsx/.css   ← Keyword bars, radar, gauge
            ├── TimelinePage.jsx/.css ← Unified chronological stream
            └── SettingsPage.jsx/.css ← Account, theme, stack info
```

---

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- A **MongoDB Atlas** account (free tier works fine)

---

## Setup

### 1 — Clone / extract

```bash
cd polisight
```

### 2 — Backend

```bash
cd backend
npm install
```

The `.env` file is pre-filled with your API keys. If you need to reset:

```bash
cp .env.example .env
# Edit .env with your keys
```

Key variables:

| Variable              | Description                          |
|-----------------------|--------------------------------------|
| `MONGO_URI`           | MongoDB Atlas connection string      |
| `JWT_SECRET`          | Long random string for signing JWTs  |
| `NEWSDATA_API_KEY`    | From newsdata.io                     |
| `GNEWS_API_KEY`       | From gnews.io                        |
| `MASTODON_ACCESS_TOKEN` | From mastodon.social/settings      |

### 3 — Frontend

```bash
cd ../frontend
npm install
```

`frontend/.env` is pre-filled:
```
VITE_API_URL=http://localhost:5000/api
```

### 4 — Run (two terminals)

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# → http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# → http://localhost:5173
```

---

## API Reference

### Auth endpoints

| Method | Endpoint                              | Auth     | Description                      |
|--------|---------------------------------------|----------|----------------------------------|
| POST   | `/api/auth/register`                  | Public   | Create account → returns JWT     |
| POST   | `/api/auth/login`                     | Public   | Login → returns JWT              |
| GET    | `/api/auth/me`                        | 🔒 JWT  | Get current user profile         |
| PUT    | `/api/auth/preferences`               | 🔒 JWT  | Update theme/accent in DB        |
| GET    | `/api/auth/saved-articles`            | 🔒 JWT  | List saved articles              |
| POST   | `/api/auth/save-article`              | 🔒 JWT  | Save an article                  |
| DELETE | `/api/auth/save-article/:articleId`   | 🔒 JWT  | Remove saved article             |

### News endpoints (all cached)

| Method | Endpoint                  | Cache | Description                        |
|--------|---------------------------|-------|------------------------------------|
| GET    | `/api/news`               | 3 min | NewsData.io articles               |
| GET    | `/api/news/headlines`     | 2 min | Top 5 headlines                    |
| GET    | `/api/gnews`              | 3 min | GNews search                       |
| GET    | `/api/gnews/top`          | 3 min | GNews top headlines                |
| GET    | `/api/mastodon`           | 1 min | Posts by hashtag                   |
| GET    | `/api/mastodon/trending`  | 2 min | Trending fediverse tags            |
| GET    | `/api/dashboard`          | 2 min | Parallel aggregate (all 3 sources) |
| GET    | `/api/analyze`            | 5 min | Keyword + sentiment analysis       |
| GET    | `/api/health`             | —     | Server health + MongoDB status     |

### Auth header format

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

---

## How Auth Works (MERN Flow)

```
Register/Login
     │
     ▼
POST /api/auth/register  or  /api/auth/login
     │
     ▼
Server: validate → bcrypt compare → jwt.sign(userId)
     │
     ▼
Response: { token, user }
     │
     ▼
Frontend AuthContext: stores token in localStorage
     │
     ▼
useApi.js: reads token → adds Authorization: Bearer <token> to every request
     │
     ▼
authMiddleware.protect: jwt.verify → User.findById → req.user
     │
     ▼
Controller: accesses req.user safely
```

---

## MongoDB User Schema

```js
{
  name:     String,           // required, 2–60 chars
  email:    String,           // unique, lowercase
  password: String,           // bcrypt hashed, select: false
  plan:     'Free'|'Pro'|'Enterprise',
  preferences: {
    theme:  'dark'|'light',
    accent: 'blue'|'purple'|'green'|'amber'|'red',
  },
  savedArticles: [{
    articleId, title, url, source, publishedAt, savedAt
  }],
  createdAt: Date,            // auto (timestamps: true)
  updatedAt: Date,
}
```

---

## Features

- **JWT auth** — register, login, persistent sessions via localStorage
- **MongoDB** — user profiles, bcrypt passwords, saved articles, theme preferences synced to DB
- **3 live APIs** — NewsData.io, GNews, Mastodon (all parallel on dashboard)
- **MVC backend** — models / controllers / routes / middleware cleanly separated
- **Server caching** — `node-cache` per endpoint (1–5 min TTL)
- **Client SWR** — stale-while-revalidate for instant repeat renders
- **Dark / light + 5 accent colors** — preferences saved to MongoDB
- **Sentiment gauge, keyword radar, category donut** — pure SVG charts
- **Unified timeline** — all 3 sources merged and sorted chronologically
