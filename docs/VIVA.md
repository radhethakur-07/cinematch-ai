# CineMatch AI - Comprehensive Viva & Technical Defense Guide

This document contains deep architectural, mathematical, and implementation explanations designed for external examiners, faculty reviewers, and technical interviewers.

---

### Q1: Why Python for the backend?
**Answer**: Python is the industry standard for machine learning, scientific computing, and data manipulation due to mature ecosystems like Scikit-Learn, NumPy, pandas, and PyTorch. Building the backend in Python allows direct, zero-overhead execution of ML inference pipelines in the same runtime as the REST API without cross-language IPC bottlenecks.

---

### Q2: Why FastAPI over Flask or Django?
**Answer**:
1. **Asynchronous Concurrency**: Built on Starlette and ASGI, FastAPI natively supports async I/O (`async/await`), enabling high-throughput non-blocking calls to external APIs (TMDB, Gemini, Supabase).
2. **Type Safety & Validation**: Integrates deeply with Pydantic v2 for automatic request/response schema parsing, serialization, and OpenAPI documentation generation.
3. **Performance**: Demonstrates benchmark performance on par with NodeJS and Go.

---

### Q3: Why Next.js 14+ with App Router for the frontend?
**Answer**: Next.js App Router provides Server-Side Rendering (SSR) for fast initial paint and search engine indexing, combined with Client Components for dynamic animations (Framer Motion) and reactive state (TanStack Query, Zustand). It compiles directly to Vercel's edge network for optimal global distribution.

---

### Q4: What is TF-IDF and how is it used in CineMatch AI?
**Answer**: **Term Frequency-Inverse Document Frequency (TF-IDF)** evaluates the statistical importance of a word within a document relative to a broader corpus:
$$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \text{IDF}(t, D)$$
$$\text{IDF}(t, D) = \ln\left(\frac{1 + |D|}{1 + |\{d \in D : t \in d\}|}\right) + 1$$
In CineMatch AI, we construct a weighted feature "soup" combining overview, tagline, genres (2x weight), keywords (2x weight), cast, and director (3x weight). Sublinear TF scaling (`sublinear_tf=True`) dampens repeated words so dominant keywords do not overpower stylistic nuances.

---

### Q5: What is Cosine Similarity and why is it preferred over Euclidean Distance?
**Answer**: Cosine similarity measures the angle between two multi-dimensional vectors rather than their magnitude:
$$\text{Cosine Similarity}(\vec{u}, \vec{v}) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|}$$
In high-dimensional text feature spaces, document length variance can distort Euclidean distance. Cosine similarity normalizes length, evaluating pure thematic alignment between films regardless of overview word count.

---

### Q6: What is Collaborative Filtering vs Content-Based Filtering?
**Answer**:
- **Content-Based Filtering**: Recommends items based on the features/attributes of the items themselves (genres, directors, plot). It works well for niche items but can suffer from over-specialization (a "filter bubble").
- **Collaborative Filtering**: Recommends items based on shared behavioral patterns among users (e.g., if User A and User B rated 5 movies similarly, User A will be recommended a 6th movie loved by User B). It discovers cross-genre serendipity but fails when interaction data is sparse.

---

### Q7: How does the Hybrid Recommendation Engine work?
**Answer**: CineMatch AI uses a dynamic weighted ensemble formula:
$$\text{Score} = w_{\text{content}} S_{\text{content}} + w_{\text{collab}} S_{\text{collab}} + w_{\text{user}} S_{\text{user}} + w_{\text{rating}} S_{\text{rating}} + w_{\text{recency}} S_{\text{recency}}$$
Default baseline weights are: $w_c = 0.40, w_{cf} = 0.30, w_u = 0.15, w_r = 0.10, w_p = 0.05$.
When a user is new (Cold Start), $w_{cf}$ is set to 0.0, and $w_u$ and $w_c$ are elevated to 0.40 and 0.30. As interaction history builds, the weights smoothly converge back to the mature hybrid state.

---

### Q8: How is the Cold-Start problem addressed?
**Answer**: Cold-start is solved via a 3-stage strategy:
1. **Onboarding Calibration**: During registration, users select starter genres and desired mood tags to immediately create an initial taste vector $\vec{V}_{\text{onboarding}}$.
2. **Dynamic Weight Shift**: The recommendation engine detects zero ratings and deactivates collaborative scoring, relying on content vectors, high voter consensus (8.0+ TMDB vote averages), and onboarding affinities.
3. **Progressive Personalization**: Every rating submitted immediately recalculates the user's vector, introducing collaborative influence without system restart.

---

### Q9: Why is Google Gemini used, and why is it NOT the recommendation engine?
**Answer**:
- **Role of Gemini**: LLMs excel at natural language understanding and unstructured parsing. Gemini transforms complex conversational prompts (*"I want a mind-bending thriller with space vibes under 2 hours"*) into structured, validated JSON intent (`{ genres: ["Sci-Fi", "Thriller"], max_runtime: 120, keywords: ["space"] }`).
- **Why NOT use Gemini as the recommender**: LLMs suffer from hallucinations (inventing non-existent movies), latency (1-3s per request), non-deterministic ranking, and high token costs. By using Gemini purely for intent extraction, the actual ranking is executed deterministically and transparently in milliseconds by Scikit-Learn.

---

### Q10: How are recommendation evaluation metrics calculated?
**Answer**:
- **Precision@K**: Fraction of top-K recommended movies that are truly relevant to the user:
  $$\text{Precision@K} = \frac{|\text{Recommended}_K \cap \text{Relevant}|}{K}$$
- **Recall@K**: Fraction of all relevant movies that appear in the top-K list:
  $$\text{Recall@K} = \frac{|\text{Recommended}_K \cap \text{Relevant}|}{|\text{Relevant}|}$$
- **NDCG@K (Normalized Discounted Cumulative Gain)**: Evaluates ranking order by heavily penalizing relevant movies that appear lower in the recommendation list:
  $$\text{DCG@K} = \sum_{i=1}^K \frac{\text{rel}_i}{\log_2(i + 1)}, \quad \text{NDCG@K} = \frac{\text{DCG@K}}{\text{IDCG@K}}$$

---

### Q11: How is security and data isolation handled?
**Answer**:
- **Row Level Security (RLS)**: PostgreSQL policies prevent users from viewing or modifying other users' ratings, preferences, or watchlists (`auth.uid() = user_id`).
- **Secret Hygiene**: `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` are backend-only environment variables and are never bundled in client JS.
- **SQL Injection Defense**: Parameterized SQL execution through SQLAlchemy ORM models.
