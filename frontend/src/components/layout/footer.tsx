import Link from "next/link";
import { Film, Github, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-cinema-border/80 bg-cinema-bg py-12 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-cyan-500 p-1 text-white">
                <Film className="h-4 w-4" />
              </div>
              <span className="font-bold text-white text-base">CineMatch AI</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Find your next obsession. Intelligent full-stack movie recommendation engine powered by machine learning and natural language AI.
            </p>
          </div>

          {/* Platform Routes */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/discover" className="hover:text-white transition-colors">Discover Movies</Link></li>
              <li><Link href="/recommendations" className="hover:text-white transition-colors">AI Recommendations</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Search Catalog</Link></li>
              <li><Link href="/watchlist" className="hover:text-white transition-colors">My Watchlist</Link></li>
            </ul>
          </div>

          {/* Technology Stack */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">Architecture</h4>
            <ul className="space-y-2 text-sm">
              <li>Next.js App Router (Vercel)</li>
              <li>FastAPI & Python 3.11 (Render)</li>
              <li>Scikit-Learn Hybrid ML Pipeline</li>
              <li>Supabase PostgreSQL & RLS</li>
            </ul>
          </div>

          {/* Attribution & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">Attribution</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              This product uses the TMDB API but is not endorsed or certified by TMDB. Movie metadata, posters, and imagery are provided by TMDB.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white border border-cinema-border px-2.5 py-1 rounded bg-cinema-card"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-cinema-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} CineMatch AI. Built for portfolio & production deployment.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Scikit-Learn, Google Gemini, and TMDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
