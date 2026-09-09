# CineMatch AI - Production Deployment Guide

## 1. Overview & Architecture

CineMatch AI is designed for seamless deployment from a **single GitHub repository**:
- **Frontend** -> **Vercel** (Root Directory: `frontend`)
- **Backend** -> **Render** (Root Directory: `backend` or Blueprint `render.yaml`)
- **Database & Auth** -> **Supabase PostgreSQL**

---

## 2. Supabase Setup (Database & Auth)

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in the Supabase Dashboard.
3. Open `backend/supabase/migrations/20240101000000_initial_schema.sql` and execute it to create all tables, indexes, and RLS policies.
4. (Optional) Execute `backend/supabase/seed.sql` to populate starter iconic movies.
5. In **Project Settings -> API**, copy:
   - `Project URL` (`SUPABASE_URL`)
   - `anon public` key (`SUPABASE_ANON_KEY`)
   - `service_role secret` key (`SUPABASE_SERVICE_ROLE_KEY`)
6. In **Database -> Connection string -> URI**, copy the PostgreSQL connection URI (`DATABASE_URL`).

---

## 3. Render Deployment (Backend)

### Method A: Using `render.yaml` (Recommended)
1. Go to [dashboard.render.com](https://dashboard.render.com).
2. Click **New + -> Blueprint**.
3. Connect your GitHub repository.
4. Render will detect `render.yaml` and set up the `cinematch-ai-backend` web service.
5. Provide your environment variables in the Render dashboard:
   - `DATABASE_URL`: Your Supabase connection URI
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY`: `your_anon_key`
   - `SUPABASE_SERVICE_ROLE_KEY`: `your_service_role_key`
   - `TMDB_API_KEY`: Your TMDB API v3 key
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `CORS_ORIGINS`: `https://your-frontend.vercel.app,http://localhost:3000`

### Method B: Manual Web Service
- **Runtime**: Python 3
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path**: `/health`

---

## 4. Vercel Deployment (Frontend)

1. Go to [vercel.com](https://vercel.com) and click **Add New -> Project**.
2. Import your GitHub repository.
3. In the configure screen:
   - Set **Root Directory** to `frontend`.
   - Framework Preset will automatically detect **Next.js**.
4. Configure **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Your deployed Render backend URL (e.g. `https://cinematch-ai-backend.onrender.com`)
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `your_anon_key`
5. Click **Deploy**.

---

## 5. TMDB Data Ingestion in Production

To populate your live database with hundreds of TMDB movies:
```bash
cd backend
python scripts/ingest_movies.py --pages 5 --api-key YOUR_TMDB_KEY
```
