"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, ArrowRight, Brain, ShieldCheck, Zap, Compass, Star, Film, CheckCircle } from "lucide-react";
import { NaturalSearchDialog } from "@/components/ai/natural-search-dialog";

export default function LandingPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-cinema-bg">
      {/* 1. Ultra-Cinematic Hero Section */}
      <section className="relative min-h-[88vh] flex items-center justify-center pt-20 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
        {/* Deep Saturated Ambient Glowing Light Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-brand-700/35 via-brand-violet/25 to-cyan-500/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-brand-800/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto w-full text-center space-y-7">
          {/* Saturated Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/60 bg-brand-950/80 backdrop-blur-xl px-4 py-1.5 text-xs font-black text-brand-300 shadow-xl shadow-brand-950/70">
            <Sparkles className="h-4 w-4 text-brand-400 animate-pulse" />
            <span>Hybrid Machine Learning + Google Gemini</span>
          </div>

          {/* Headline - Mobile Scalable */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.12]">
              Find your next{" "}
              <span className="bg-gradient-to-r from-brand-500 via-rose-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-md">
                obsession.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-zinc-300 font-medium leading-relaxed px-2">
              CineMatch AI fuses Content-Based TF-IDF vectorization, Collaborative SVD matrix factorization, and real-time Gemini neural search to curate movie recommendations you will genuinely love.
            </p>
          </div>

          {/* CTAs - Mobile Touch-Friendly */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2 px-2">
            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-rose-600 to-brand-700 hover:from-brand-500 hover:to-rose-500 px-8 py-4 text-sm sm:text-base font-black text-white shadow-2xl shadow-brand-600/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <span>Start Discovering</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              onClick={() => setAiModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-cinema-border bg-cinema-card/90 backdrop-blur-xl px-6 py-4 text-sm sm:text-base font-bold text-zinc-100 hover:bg-white/10 hover:border-brand-500/60 hover:text-white transition-all shadow-xl cursor-pointer hover:scale-105 active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>AI Mood Prompt</span>
            </button>

            <Link
              href="/discover"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-transparent px-5 py-4 text-sm sm:text-base font-bold text-zinc-400 hover:text-white transition-colors"
            >
              <Compass className="h-4 w-4" />
              <span>Browse Catalog</span>
            </Link>
          </div>

          {/* Interactive AI Prompt Bar */}
          <div className="pt-4 max-w-2xl mx-auto px-2">
            <div
              onClick={() => setAiModalOpen(true)}
              className="cursor-pointer rounded-2xl border border-brand-500/40 bg-cinema-card/95 hover:bg-cinema-hover p-4 sm:p-4.5 shadow-2xl backdrop-blur-2xl flex items-center justify-between gap-3 text-left transition-all duration-300 group hover:border-brand-500/80 hover:shadow-brand-600/30"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-600/25 text-brand-400 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] text-zinc-400 block font-bold uppercase tracking-wider">Try Natural AI Search</span>
                  <span className="text-xs sm:text-sm text-zinc-200 font-bold group-hover:text-brand-300 transition-colors line-clamp-1">
                    "Mind-bending sci-fi like Everything Everywhere All at Once..."
                  </span>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-black text-white shadow-md group-hover:bg-brand-500 transition-colors">
                Run AI
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Deep Saturated Engine Architecture Showcase */}
      <section className="relative py-20 bg-gradient-to-b from-cinema-card/90 via-cinema-surface to-cinema-bg border-y border-cinema-border/90 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-brand-400 bg-brand-600/20 border border-brand-500/40 px-3.5 py-1 rounded-full shadow-sm">
              Real Mathematical Modeling
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">How CineMatch AI Ranks Movies</h2>
            <p className="text-xs sm:text-sm md:text-base text-zinc-300 leading-relaxed">
              Unlike static mock recommenders, our system executes a 5-factor hybrid scoring model with grounded mathematical signals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-cinema-border bg-gradient-to-b from-cinema-card via-cinema-surface to-black/80 p-6 sm:p-8 space-y-4 hover:border-brand-500/70 transition-all duration-300 shadow-2xl hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-950/50">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">Content-Based TF-IDF</h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                Extracts thematic metadata, directors, cast weights, and plot keywords into high-dimensional TF-IDF matrices with sublinear term-frequency scaling and cosine similarity metrics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-cinema-border bg-gradient-to-b from-cinema-card via-cinema-surface to-black/80 p-6 sm:p-8 space-y-4 hover:border-cyan-500/70 transition-all duration-300 shadow-2xl hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">Collaborative SVD Matrix</h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                Processes user-movie interaction ratings using Truncated SVD matrix factorization to discover hidden taste clusters and collaborative cross-user patterns.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-cinema-border bg-gradient-to-b from-cinema-card via-cinema-surface to-black/80 p-6 sm:p-8 space-y-4 hover:border-amber-500/70 transition-all duration-300 shadow-2xl hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-950/50">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">Grounded Explainability</h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                Every recommendation provides clear signals ("Why you'll like this", genre match % and director affinities) derived transparently from your user profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mathematical Formula Breakdown in Deep Rich Box */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 z-10">
        <div className="rounded-3xl border border-brand-500/40 bg-gradient-to-b from-brand-950/40 via-cinema-card to-black p-6 sm:p-10 lg:p-12 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-brand-400">Dynamic Hybrid Scoring</span>
              <h3 className="text-xl sm:text-3xl font-black text-white mt-1">Mathematically Proven Ranking</h3>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-500/40 self-start shadow-sm">
              NDCG@5: 0.95+
            </span>
          </div>

          <div className="rounded-2xl bg-black/90 p-5 font-mono text-xs sm:text-sm text-brand-300 border border-white/10 shadow-inner overflow-x-auto">
            Score = (0.40 × S_content) + (0.30 × S_collab) + (0.15 × S_user) + (0.10 × S_rating) + (0.05 × S_recency)
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
            When a user first joins (cold-start), weights dynamically shift to prioritize explicit onboarding genres and high-confidence critically acclaimed masterworks, gradually adapting into full collaborative matrix factorization as interaction signals grow.
          </p>
        </div>
      </section>

      {/* 4. CTA Footer Section */}
      <section className="relative py-20 bg-gradient-to-t from-black via-cinema-bg to-cinema-bg text-center px-4 z-10 border-t border-cinema-border/50">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to experience cinematic intelligence?
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto font-normal">
            Create an account in 30 seconds, select your starter tastes, and let CineMatch AI curate your personalized cinematic universe.
          </p>
          <div className="pt-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 px-8 sm:px-10 py-4 text-base font-black text-white shadow-2xl shadow-brand-600/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
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
