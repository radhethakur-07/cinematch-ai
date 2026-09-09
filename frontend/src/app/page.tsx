"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Sparkles, ArrowRight, Brain, Film, Play, Compass, Star, ShieldCheck, CheckCircle, Zap } from "lucide-react";
import { NaturalSearchDialog } from "@/components/ai/natural-search-dialog";

export default function LandingPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* 1. Cinematic Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient background glowing circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-600/20 via-cyan-500/15 to-transparent blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-600/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-brand-300 shadow-xl animate-fade-in">
            <Sparkles className="h-4 w-4 text-brand-400 animate-pulse" />
            <span>Next-Gen Machine Learning + Google Gemini</span>
          </div>

          {/* Hero Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
              Find your next{" "}
              <span className="bg-gradient-to-r from-brand-500 via-rose-400 to-brand-accent bg-clip-text text-transparent drop-shadow-sm">
                obsession.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-xl text-zinc-300 font-normal leading-relaxed">
              CineMatch AI combines content-based feature vectorization, collaborative matrix factorization, and natural language AI intent mapping to deliver personalized recommendations you actually want to watch.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-brand-600/25 hover:from-brand-500 hover:to-rose-500 hover:scale-105 transition-all"
            >
              <span>Start Discovering</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              onClick={() => setAiModalOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-cinema-border bg-cinema-card/80 backdrop-blur-md px-6 py-3.5 text-base font-semibold text-zinc-200 hover:bg-white/10 hover:text-white transition-colors shadow-lg"
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Try AI Mood Prompt</span>
            </button>

            <Link
              href="/discover"
              className="flex items-center gap-2 rounded-xl border border-transparent px-5 py-3.5 text-base font-medium text-zinc-400 hover:text-white transition-colors"
            >
              <Compass className="h-4 w-4" />
              <span>Browse Catalog</span>
            </Link>
          </div>

          {/* Quick Mock Interactive AI Prompt Bar on Hero */}
          <div className="pt-8 max-w-2xl mx-auto">
            <div
              onClick={() => setAiModalOpen(true)}
              className="cursor-pointer rounded-2xl border border-cinema-border/80 bg-cinema-card/90 p-4 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-left hover:border-brand-500/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-600/20 text-brand-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs text-zinc-400 block font-medium">Describe what you want to watch</span>
                  <span className="text-sm text-zinc-200 font-semibold group-hover:text-brand-300 transition-colors">
                    "I want a mind-bending sci-fi movie like Interstellar with deep space themes..."
                  </span>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white group-hover:bg-brand-600 transition-colors">
                Run AI
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Recommendation Engine Architecture Showcase */}
      <section className="py-20 bg-cinema-card/50 border-y border-cinema-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-500">True Production Intelligence</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">How CineMatch AI Ranks Movies</p>
            <p className="text-sm text-zinc-400">
              Unlike simplistic genre matchers, our engine executes a dynamic weighted scoring formula backed by real mathematical modeling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-cinema-border bg-cinema-card p-7 space-y-4 hover:border-brand-500/40 transition-colors">
              <div className="h-11 w-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Content-Based TF-IDF</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Vectorizes overviews, directors, cast, weighted genres, and thematic keywords into sparse TF-IDF matrices with sublinear scaling and cosine similarity metrics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-cinema-border bg-cinema-card p-7 space-y-4 hover:border-brand-500/40 transition-colors">
              <div className="h-11 w-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Collaborative Filtering</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Utilizes user-item interaction matrices and Truncated SVD matrix factorization to identify latent taste clusters without cold-start failures.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-cinema-border bg-cinema-card p-7 space-y-4 hover:border-brand-500/40 transition-colors">
              <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Grounded Explainability</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Every suggested movie includes transparent "Why you'll like this" signals and realistic match percentages derived mathematically from your profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mathematical Formula Breakdown */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
        <div className="rounded-3xl border border-brand-500/30 bg-gradient-to-b from-brand-950/20 via-cinema-card to-cinema-card p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Dynamic Hybrid Scoring</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">Mathematically Proven Ranking</h3>
            </div>
            <span className="text-xs font-mono bg-white/10 px-3 py-1.5 rounded-lg text-zinc-300 border border-white/10 self-start">
              Precision@5: 0.80+
            </span>
          </div>

          <div className="rounded-xl bg-black/60 p-5 font-mono text-xs sm:text-sm text-brand-300 border border-white/10 overflow-x-auto">
            Score = (0.40 × S_content) + (0.30 × S_collab) + (0.15 × S_user) + (0.10 × S_rating) + (0.05 × S_recency)
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed">
            For brand-new users with zero ratings, the engine automatically adjusts weights to emphasize onboarding preferences and critically acclaimed titles, seamlessly converging back to full hybrid balance as interaction history accumulates.
          </p>
        </div>
      </section>

      {/* 4. Ready to Discover Call to Action */}
      <section className="py-20 bg-gradient-to-t from-black via-cinema-bg to-cinema-bg text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to experience cinematic intelligence?
          </h2>
          <p className="text-base text-zinc-400 max-w-xl mx-auto">
            Create an account in 30 seconds, select your starter genres, and let CineMatch AI curate your personalized movie universe.
          </p>
          <div className="pt-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-brand-600/40 hover:bg-brand-500 hover:scale-105 transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <NaturalSearchDialog open={aiModalOpen} onOpenChange={setAiModalOpen} />
    </div>
  );
}
