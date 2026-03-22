# PoliticView – AI Political Intelligence Dashboard
### MERN Stack · MongoDB · Express · React · Node.js

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| AI Engine | Google Gemini API (gemini-1.5-flash / gemini-1.5-pro) |
| News Sources | NewsData.io · GNews · NewsAPI.org |
| Social | Mastodon API (mastodon.social) |
| Charts | Chart.js + react-chartjs-2 |

---

## Project Structure

```
politicview/
├── backend/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── intelligenceController.js
│   │   ├── newsController.js
│   │   ├── socialController.js
│   │   ├── analyticsController.js
│   │   └── simulationController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Analysis.js
│   │   └── NewsCache.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── intelligence.js
│   │   ├── news.js
│   │   ├── social.js
│   │   ├── analytics.js
│   │   └── simulation.js
│   ├── services/
│   │   ├── claudeService.js
│   │   ├── newsService.js
│   │   └── mastodonService.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AICard.jsx
    │   │   ├── Header.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── ActivityLog.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   └── useAI.js
    │   ├── pages/
    │   │   ├── AuthPage.jsx
    │   │   ├── OverviewSection.jsx
    │   │   ├── CoreIntelligenceSection.jsx
    │   │   ├── IntelligenceSections.jsx
    │   │   ├── StrategySections.jsx
    │   │   ├── NewsFeedSection.jsx
    │   │   ├── SocialFeedSection.jsx
    │   │   ├── SupportSections.jsx
    │   │   └── ChiefStrategistSection.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Quick Start

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment

Edit `backend/.env` and add your **Google Gemini API key**:

```env
GEMINI_API_KEY=AIzaSy_your_key_here
GEMINI_MODEL=gemini-1.5-flash   # or gemini-1.5-pro
```

Get a free key at: https://aistudio.google.com/app/apikey

All other keys (MongoDB, NewsData, GNews, NewsAPI, Mastodon) are pre-filled.

### 3. Run development servers

**Terminal 1 – Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 – Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### 4. Open the app

Navigate to **http://localhost:5173**

Register a new account, then start using all 15 intelligence modules.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Intelligence (all require JWT)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/intelligence/run/:module` | Run any AI module |
| GET | `/api/intelligence/history` | Get analysis history |
| GET | `/api/intelligence/stats` | Usage statistics |

### Simulation (all require JWT)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/simulation/run/:module` | Run simulation module |

### News (require JWT)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/news/search?q=query` | Search all news sources |
| GET | `/api/news/top` | Top politics news |

### Social (require JWT)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/social/search?q=query` | Search Mastodon |
| GET | `/api/social/trending` | Trending posts & hashtags |

### Analytics (require JWT)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/dashboard` | Dashboard stats |
| GET | `/api/analytics/regional` | Regional sentiment data |

---

## AI Modules

| Module ID | Section | Description |
|---|---|---|
| `speech-sim` | Core Intelligence | Simulate public reaction to speech |
| `opinion-forecast` | Core Intelligence | 7-day opinion forecast |
| `sentiment-pulse` | Core Intelligence | Real-time sentiment analysis |
| `emotional-heatmap` | Core Intelligence | Emotion mapping by region |
| `pov-analyzer` | Public Insight | Public POV breakdown |
| `gtm-analysis` | Strategy | Launch strategy planning |
| `opposition-mapper` | Strategy | Opposition weakness mapping |
| `policy-impact` | Strategy | Policy trust impact simulation |
| `speech-optimizer` | Content Engine | Optimize political messaging |
| `viral-scorer` | Content Engine | Score viral potential |
| `meme-analyzer` | Content Engine | Meme culture analysis |
| `mirror-sim` | Simulation | Reaction rehearsal |
| `backlash-forecast` | Simulation | Backlash risk scoring |
| `media-predictor` | Simulation | Media coverage prediction |
| `controversy-model` | Simulation | Crisis escalation modeling |
| `reputation-estimator` | Simulation | Reputation impact estimation |
| `rally-analyzer` | Geo Intelligence | Rally impact analysis |
| `turnout-engine` | Geo Intelligence | Voter turnout projection |
| `geo-snapshot` | Geo Intelligence | Geo-economic snapshot |
| `issue-memory` | Memory Layer | Historical sentiment recall |
| `scandal-recall` | Memory Layer | Scandal echo detection |
| `reality-gap` | Innovation | Narrative vs reality check |
| `misinfo-radar` | Influence | Misinformation detection |
| `chief-strategist` | Chief Strategist | Full strategic synthesis |

---

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://...

# Auth
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d

# AI
GEMINI_API_KEY=AIza...          ← ADD THIS
GEMINI_MODEL=gemini-1.5-flash   # or gemini-1.5-pro for higher quality

# News APIs
NEWSDATA_API_KEY=...
GNEWS_API_KEY=...
NEWSAPI_KEY=...

# Social
MASTODON_ACCESS_TOKEN=...
MASTODON_INSTANCE=mastodon.social
```

---

## Features

- **JWT Authentication** – Register/login with secure token-based auth
- **MongoDB Persistence** – All AI analyses saved with full history
- **15 AI Modules** – Every module calls Claude API with specialized prompts
- **3 News Sources** – NewsData + GNews + NewsAPI aggregated & cached
- **Mastodon Integration** – Live social search + trending posts/hashtags
- **News Caching** – MongoDB TTL cache (1 hour) to avoid API hammering
- **Rate Limiting** – 200 req/15min general, 20 req/min for AI endpoints
- **Scroll Spy Sidebar** – Active nav item tracks scroll position
- **Activity Log** – Real-time log of all operations
- **Light Theme** – Clean editorial design with Playfair + DM Sans fonts
