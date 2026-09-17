"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuth((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-7 rounded-xl border border-cinema-border bg-cinema-surface p-8 shadow-card">
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 mb-2">
            <span className="text-xl font-semibold tracking-tight text-cinema-text">CineMatch</span>
            <span className="rounded bg-crimson px-1.5 py-0.5 text-[10px] font-semibold text-white">AI</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-cinema-text">Welcome Back</h1>
          <p className="text-xs text-cinema-muted">Sign in to access your personalized recommendations and watchlist.</p>
        </div>

        {error && (
          <div className="rounded-lg bg-crimson/10 border border-crimson/20 p-3 text-xs text-crimson">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-cinema-text">Email Address</label>
            <div className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg bg-cinema-elevated border border-cinema-border px-3.5 py-2.5 pl-10 text-xs text-cinema-text placeholder-cinema-muted/60 focus:border-crimson focus:outline-none transition-colors"
              />
              <Mail className="absolute left-3.5 h-4 w-4 text-cinema-muted" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-cinema-text">Password</label>
            <div className="relative flex items-center">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg bg-cinema-elevated border border-cinema-border px-3.5 py-2.5 pl-10 text-xs text-cinema-text placeholder-cinema-muted/60 focus:border-crimson focus:outline-none transition-colors"
              />
              <Lock className="absolute left-3.5 h-4 w-4 text-cinema-muted" />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-xs gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span>Sign In</span><ArrowRight className="h-3.5 w-3.5" /></>}
          </Button>
        </form>

        <div className="text-center text-xs text-cinema-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-crimson hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
