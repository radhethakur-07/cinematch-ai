import Link from "next/link";
import { Film, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-cinema-border bg-cinema-void py-12 text-cinema-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-crimson p-1 text-white">
                <Film className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold text-cinema-text text-sm">CineMatch AI</span>
            </div>
            <p className="text-xs text-cinema-muted leading-relaxed">
              Personalized movie discovery platform powered by hybrid machine learning and natural language understanding.
            </p>
          </div>

          {/* Platform Routes */}
          <div>
            <h4 className="text-xs font-semibold text-cinema-secondary uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/discover" className="text-cinema-muted hover:text-cinema-text transition-colors">Discover Movies</Link></li>
              <li><Link href="/recommendations" className="text-cinema-muted hover:text-cinema-text transition-colors">AI Match Hub</Link></li>
              <li><Link href="/search" className="text-cinema-muted hover:text-cinema-text transition-colors">Search Catalog</Link></li>
              <li><Link href="/watchlist" className="text-cinema-muted hover:text-cinema-text transition-colors">Watchlist</Link></li>
            </ul>
          </div>

          {/* Technology Stack */}
          <div>
            <h4 className="text-xs font-semibold text-cinema-secondary uppercase tracking-wider mb-3">Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li>Next.js 14 App Router & Tailwind CSS</li>
              <li>FastAPI & Python 3.11 Backend</li>
              <li>Hybrid TF-IDF & SVD Matrix ML Pipeline</li>
              <li>Supabase PostgreSQL Database</li>
            </ul>
          </div>

          {/* Attribution & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-cinema-secondary uppercase tracking-wider mb-3">Attribution</h4>
            <p className="text-xs text-cinema-muted leading-relaxed mb-3">
              Film metadata, posters, and imagery provided by TMDB. This project is not officially endorsed or certified by TMDB.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/radhethakur-07/cinematch-ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-cinema-secondary hover:text-cinema-text border border-cinema-border px-2.5 py-1.5 rounded-control bg-cinema-surface hover:bg-cinema-hover transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-cinema-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cinema-disabled">
          <p>© {new Date().getFullYear()} CineMatch AI. Built for portfolio & production evaluation.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Scikit-Learn, Google Gemini, and TMDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
