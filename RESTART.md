# ⚡ Quick Fix — How to Apply Updates

## When you get "Unknown module" or 404 errors

These happen because the backend server is still running **old code**.
You must restart it after every update.

### Step 1 — Stop the old server
Press `Ctrl + C` in the backend terminal.

### Step 2 — Add your Gemini API key (if not done yet)
Open `backend/.env` and set:
```
GEMINI_API_KEY=AIzaSy_your_key_here
```
Get a free key at: https://aistudio.google.com/app/apikey

### Step 3 — Restart both servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
Wait for:
```
✅ MongoDB connected
✅ GEMINI_API_KEY: configured
🚀 PoliticView backend running on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
The frontend hot-reloads automatically — no restart needed for frontend changes.

---

## Error Reference

| Error | Cause | Fix |
|---|---|---|
| `Unknown module: emotional-heatmap` | Old server running | Restart backend |
| `404 on /api/intelligence/...` | Old server running | Restart backend |
| `⚠ Gemini API key not configured` | Missing key in .env | Add `GEMINI_API_KEY=AIza...` to backend/.env |
| `500 Internal Server Error` | Gemini key wrong or quota exceeded | Check key at aistudio.google.com |
| `Request failed with status 429` | AI rate limit | Wait 60 seconds |
