"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, ArrowRight, Brain, Film, Compass, Layers, SlidersHorizontal, Eye } from "lucide-react";
import { NaturalSearchDialog } from "@/components/ai/natural-search-dialog";

export default function LandingPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-cinema-void">

      {/* 1. Hero Section */}
      <section className="relative min-h-[82vh] flex items-center justify-center pt-16 pb-14 px-4 sm:px-6 lg:px-8 border-b border-cinema-border">
        <div className="max-w-4xl mx-auto w-full text-center space-y-6">

          {/* Subheading / Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cinema-border bg-cinema-surface px-3.5 py-1 text-xs font-medium text-cinema-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-crimson" />
            <span>Hybrid Recommendation Engine &middot; Google Gemini Natural Search</span>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-cinema-text leading-[1.15]">
              Find your next great film.
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-cinema-secondary leading-relaxed font-normal">
              Personalized movie discovery powered by your taste, your viewing history, and multi-factor recommendation algorithms.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-btn bg-crimson hover:bg-crimson-hover px-6 py-3 text-sm font-semibold text-white shadow-subtle transition-colors cursor-pointer"
            >
              <span>Start Discovering</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/discover"
              className="inline-flex items-center justify-center gap-2 rounded-btn border border-cinema-border bg-cinema-surface hover:bg-cinema-hover px-5 py-3 text-sm font-medium text-cinema-text transition-colors"
            >
              <Compass className="h-4 w-4 text-cinema-muted" />
              <span>Explore Catalog</span>
            </Link>
          </div>

          {/* Natural Search Prompt Preview */}
          <div className="pt-6 max-w-xl mx-auto">
            <div
              onClick={() => setAiModalOpen(true)}
              className="cursor-pointer rounded-card border border-cinema-border bg-cinema-surface hover:bg-cinema-elevated hover:border-cinema-secondary/30 p-3.5 flex items-center justify-between gap-3 text-left transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Sparkles className="h-4 w-4 text-crimson flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] text-cinema-muted uppercase font-medium block">Ask CineMatch</span>
                  <span className="text-xs sm:text-sm text-cinema-secondary truncate block">
                    &ldquo;A slow-burn psychological thriller with deep atmosphere...&rdquo;
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-crimson flex-shrink-0 px-2.5 py-1 rounded bg-crimson-soft">
                Try AI
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How CineMatch Works - 3 Clean Cards */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-cinema-border bg-cinema-surface">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-cinema-text">
              How CineMatch Works
            </h2>
            <p className="text-xs sm:text-sm text-cinema-muted">
              Three complementary recommendation methodologies combined into a unified ranking pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-card border border-cinema-border bg-cinema-void p-6 space-y-3">
              <div className="w-10 h-10 rounded-control bg-cinema-elevated border border-cinema-border flex items-center justify-center text-crimson">
                <Brain className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-cinema-text">Content Understanding</h3>
              <p className="text-xs sm:text-sm text-cinema-secondary leading-relaxed">
                Extracts thematic features, directors, cast weights, and plot keywords into high-dimensional TF-IDF vectors to compute content similarity.
              </p>
            </div>

            <div className="rounded-card border border-cinema-border bg-cinema-void p-6 space-y-3">
              <div className="w-10 h-10 rounded-control bg-cinema-elevated border border-cinema-border flex items-center justify-center text-gold">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-cinema-text">Collaborative Signals</h3>
              <p className="text-xs sm:text-sm text-cinema-secondary leading-relaxed">
                Analyzes user ratings and interaction history using matrix factorization algorithms to uncover cross-user affinity clusters.
              </p>
            </div>

            <div className="rounded-card border border-cinema-border bg-cinema-void p-6 space-y-3">
              <div className="w-10 h-10 rounded-control bg-cinema-elevated border border-cinema-border flex items-center justify-center text-semantic-info">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-cinema-text">Personalized Ranking</h3>
              <p className="text-xs sm:text-sm text-cinema-secondary leading-relaxed">
                Blends content alignment, collaborative signals, user preferences, and TMDB critical metrics into dynamic match scores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Recommendation Pipeline Diagram */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-cinema-border bg-cinema-void">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-crimson">Recommendation Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-cinema-text">
              Multi-Factor Hybrid Scoring
            </h2>
            <p className="text-xs sm:text-sm text-cinema-muted">
              Evaluated with standard information retrieval metrics and dynamic cold-start weighting.
            </p>
          </div>

          <div className="rounded-panel border border-cinema-border bg-cinema-surface p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
              <div className="flex-1 p-3 rounded-card bg-cinema-void border border-cinema-border">
                <span className="text-xs font-semibold text-cinema-text block">1. User Profile</span>
                <span className="text-[11px] text-cinema-muted">Ratings & Watchlist</span>
              </div>
              <span className="text-cinema-muted font-bold">→</span>
              <div className="flex-1 p-3 rounded-card bg-cinema-void border border-cinema-border">
                <span className="text-xs font-semibold text-cinema-text block">2. Vector Matching</span>
                <span className="text-[11px] text-cinema-muted">TF-IDF & SVD Matrix</span>
              </div>
              <span className="text-cinema-muted font-bold">→</span>
              <div className="flex-1 p-3 rounded-card bg-cinema-void border border-cinema-border">
                <span className="text-xs font-semibold text-cinema-text block">3. Hybrid Scoring</span>
                <span className="text-[11px] text-cinema-muted">Weighted Multi-Signal</span>
              </div>
              <span className="text-cinema-muted font-bold">→</span>
              <div className="flex-1 p-3 rounded-card bg-crimson-soft border border-crimson/30">
                <span className="text-xs font-semibold text-crimson block">4. Final Feed</span>
                <span className="text-[11px] text-cinema-secondary">Ranked & Explained</span>
              </div>
            </div>

            <div className="p-3.5 rounded-control bg-cinema-void border border-cinema-border-subtle font-mono text-xs text-cinema-secondary overflow-x-auto text-center">
              Score = (0.40 × Content) + (0.30 × Collaborative) + (0.15 × User) + (0.10 × Rating) + (0.05 × Recency)
            </div>
          </div>
        </div>
      </section>

      {/* 4. Final CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-cinema-text">
            Ready to explore your personal cinema feed?
          </h2>
          <p className="text-xs sm:text-sm text-cinema-secondary max-w-md mx-auto">
            Set up your taste profile in seconds and discover films tailored precisely to your cinematic preferences.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-btn bg-crimson hover:bg-crimson-hover px-6 py-3 text-sm font-semibold text-white shadow-subtle transition-colors cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <NaturalSearchDialog open={aiModalOpen} onOpenChange={setAiModalOpen} />
    </div>
  );
}
