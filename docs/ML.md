# CineMatch AI - Machine Learning Recommendation Pipeline

## 1. Machine Learning Architecture Overview

CineMatch AI uses a multi-tier hybrid recommendation framework designed to deliver accurate, non-trivial recommendations with zero cold-start crashes and mathematically grounded explainability.

---

## 2. Recommendation Algorithms

### A. Content-Based Filtering (TF-IDF & Cosine Similarity)
- **Feature Engineering & Soup Construction**:
  Combines movie overview, tagline, genres (weighted 2x), keywords (weighted 2x), top cast, and director (weighted 3x).
  ```python
  soup = f"{overview} {tagline} {genres*2} {keywords*2} {cast} {directors*3}"
  ```
- **Vectorization**:
  Uses Scikit-Learn `TfidfVectorizer` with `ngram_range=(1, 2)`, English stop word removal, and sublinear term-frequency scaling (`sublinear_tf=True`).
- **Similarity Metric**:
  Calculates pairwise cosine similarity:
  $$\text{Cosine Similarity}(u, v) = \frac{u \cdot v}{\|u\|_2 \|v\|_2}$$

### B. User Taste Vector Compilation
- Centered rating weighting ($r_i - 2.5$) applied to movie TF-IDF vectors:
  $$\vec{V}_{\text{user}} = \sum_{i \in \text{Rated}} (r_i - 2.5) \cdot \vec{V}_{\text{movie}_i} + 1.5 \cdot \vec{V}_{\text{onboarding}}$$
- Normalized to unit length ($\|\vec{V}_{\text{user}}\|_2 = 1$).

### C. Collaborative Filtering (Matrix Factorization)
- User-item rating interaction matrix factorized using **Truncated SVD** (Latent Semantic Analysis):
  $$\mathbf{R} \approx \mathbf{U} \mathbf{\Sigma} \mathbf{V}^T$$
- Item-Item collaborative similarity calculated from interaction vectors.
- Supports cold-start: returns 0.0 without crashing when an unknown user is encountered.

### D. Dynamic Hybrid Scoring Formula
$$\text{Score} = w_{\text{content}} S_{\text{content}} + w_{\text{collab}} S_{\text{collab}} + w_{\text{user}} S_{\text{user}} + w_{\text{rating}} S_{\text{rating}} + w_{\text{recency}} S_{\text{recency}}$$

**Configurable Weights & Cold-Start Adaptation:**

| User Profile State | Content ($w_c$) | Collab ($w_{cf}$) | User Pref ($w_u$) | TMDB Rating ($w_r$) | Recency ($w_p$) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Cold Start (0 ratings)** | 0.30 | **0.00** | 0.40 | 0.20 | 0.10 |
| **Warm Start (1-4 ratings)**| 0.35 | **0.15** | 0.25 | 0.15 | 0.10 |
| **Mature User (5+ ratings)**| 0.40 | **0.30** | 0.15 | 0.10 | 0.05 |

---

## 3. Evaluation & Benchmarking Results

Evaluated using `backend/ml/evaluation/evaluate_model.py`:

| Model Architecture | Precision@5 | Recall@5 | NDCG@5 |
| :--- | :---: | :---: | :---: |
| **Popularity Baseline** | 0.3000 | 0.5000 | 0.4882 |
| **Content-Based Only** | 0.6000 | 1.0000 | 0.9122 |
| **Collaborative Only** | 0.6000 | 1.0000 | 0.9524 |
| **Hybrid Recommender (CineMatch)** | **0.6000** | **1.0000** | **0.9524** |

---

## 4. Grounded Explainability Engine

Explanations are never randomly selected. They are systematically derived from the computed scoring breakdown:
1. **Thematic Signal**: `"Shares thematic DNA with [High-Rated Movie]"`
2. **Genre Affinity**: `"Matches your affinity for [Top Genre]"`
3. **Collaborative Signal**: `"Loved by viewers with similar cinematic taste"`
4. **Acclaim Signal**: `"Masterpiece acclaim ([Rating]★ community score)"`
