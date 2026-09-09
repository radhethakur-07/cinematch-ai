"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Film, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

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
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-cinema-border bg-cinema-card p-8 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-cyan-500 p-2 shadow-lg shadow-brand-600/30">
            <Film className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-xs text-zinc-400">Sign in to access your personalized recommendation feeds</p>
        </div>

        {error && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Email Address</label>
            <div className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl bg-black/40 border border-cinema-border px-3.5 py-2.5 pl-10 text-sm text-zinc-100 placeholder-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <Mail className="absolute left-3.5 h-4 w-4 text-zinc-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Password</label>
            <div className="relative flex items-center">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-black/40 border border-cinema-border px-3.5 py-2.5 pl-10 text-sm text-zinc-100 placeholder-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <Lock className="absolute left-3.5 h-4 w-4 text-zinc-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-bold text-white hover:bg-brand-500 shadow-lg shadow-brand-600/30 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span>Sign In</span><ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-brand-400 hover:text-brand-300 underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
