# CineMatch AI - System Architecture Documentation

## 1. Executive Architecture Summary

CineMatch AI is designed as a decoupled, multi-tier, production-ready AI Movie Recommendation & Discovery Platform. The frontend is built on **Next.js 14+ (App Router)** and deployed to **Vercel**, while the backend is an asynchronous, versioned REST API built on **FastAPI (Python 3.11+)** and deployed to **Render**. Persistent relational data, Row Level Security (RLS), and authentication are managed through **Supabase PostgreSQL**.

---

## 2. High-Level Architectural Flow

```mermaid
flowchart TD
    subgraph ClientTier ["Client Tier (Vercel)"]
        Browser["User Browser"]
        NextApp["Next.js 14+ (App Router + SSR/CSR)"]
        State["Zustand Auth Store + TanStack Query Caching"]
    end

    subgraph ApiTier ["API & Microservices Tier (Render)"]
        FastAPI["FastAPI App Gateway (/api/v1)"]
        SecMiddleware["JWT / Supabase Auth Verification"]
        ReqLogger["Structured Logging & X-Request-ID Middleware"]
        
        subgraph Services ["Modular Domain Services"]
            RecService["Recommendation Orchestrator"]
            TMDBService["TMDB Async Client + TTL Cache"]
            AIService["Google Gemini Natural Language Agent"]
            AuthService["Auth & Session Manager"]
            AdminService["Analytics & Telemetry Aggregator"]
        end
    end

    subgraph MLTier ["Machine Learning Pipeline"]
        TFIDF["TF-IDF Vectorizer (10,000 features, 1-2 ngrams)"]
        CosineSim["Cosine Similarity Sparse Matrix"]
        CollabSVD["Truncated SVD Matrix Factorization"]
        HybridEngine["Dynamic Weighting Scorer + Explainability"]
    end

    subgraph DataTier ["Data & Security Tier (Supabase)"]
        SupabaseAuth["Supabase Auth Engine"]
        Postgres[(PostgreSQL Relational DB)]
        RLS["Row Level Security Policies"]
    end

    Browser --> NextApp
    NextApp --> State
    State -->|HTTP / JSON with JWT| FastAPI
    FastAPI --> SecMiddleware
    FastAPI --> ReqLogger
    FastAPI --> Services
    RecService --> MLTier
    Services --> Postgres
    SecMiddleware --> SupabaseAuth
    TMDBService -->|Async HTTP| TMDBApi["TMDB v3 API"]
    AIService -->|Google Generative AI SDK| GeminiApi["Google Gemini API"]
```

---

## 3. Decoupling Principles & Modularity

1. **Recommendation Independence**: The recommendation algorithms (`ContentEngine`, `CollaborativeEngine`, `HybridRecommender`) reside in `backend/ml/` and are isolated from the web framework. Algorithms can be trained, benchmarked, or upgraded without modifying web routing or database schema code.
2. **Resilient Fallback Design**:
   - If Google Gemini API is offline or rate-limited, the system falls back to an intelligent heuristic NLP parser.
   - If TMDB API is offline or unconfigured, the system serves preloaded high-fidelity seed movie masterworks.
   - If collaborative filtering lacks user support (Cold Start), weights dynamically rebalance toward user onboarding preferences and content vectors.
3. **Multi-Platform Deployment-Ready**:
   - `frontend/` builds as a standard standalone Vercel Next.js web application.
   - `backend/` builds as a containerized or native Python application on Render using dynamic `$PORT` binding.
