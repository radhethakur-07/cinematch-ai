"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, Film, Compass, Bookmark, User, Search, LogOut, ShieldAlert, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { NaturalSearchDialog } from "@/components/ai/natural-search-dialog";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/home", label: "Home", icon: Film },
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/recommendations", label: "AI Match", icon: Sparkles },
    { href: "/watchlist", label: "Watchlist", icon: Bookmark, authRequired: true },
    { href: "/profile", label: "Taste Profile", icon: User, authRequired: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-cinema-bg/95 backdrop-blur-2xl transition-all shadow-2xl">
        {/* Top vibrant saturated gradient line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-600 via-brand-violet to-transparent" />

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href={isAuthenticated ? "/home" : "/"} className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 via-rose-700 to-brand-violet p-2 shadow-lg shadow-brand-600/40 border border-white/20 group-hover:scale-105 transition-all">
              <Film className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-xl tracking-wider text-white drop-shadow">
                CineMatch<span className="text-brand-500 text-[10px] ml-1.5 font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-brand-600/25 border border-brand-500/50 font-extrabold shadow-sm">AI</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-cinema-card border border-cinema-border/90 shadow-inner">
            {navLinks.map((link) => {
              if (link.authRequired && !isAuthenticated) return null;
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    isActive ? "text-white bg-gradient-to-r from-brand-600 to-rose-700 shadow-md shadow-brand-600/40" : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-zinc-400"}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick AI Mood Prompt Button */}
            <button
              onClick={() => setAiModalOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-brand-600/30 via-brand-violet/30 to-cyan-500/30 border border-brand-500/60 text-zinc-100 hover:text-white text-xs font-extrabold shadow-lg shadow-brand-950/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">AI Mood Match</span>
              <span className="sm:hidden text-[11px]">AI</span>
            </button>

            {/* Direct Search Link */}
            <Link
              href="/search"
              className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Search Movies"
            >
              <Search className="h-4 w-4" />
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user?.is_admin && (
                  <Link
                    href="/admin"
                    className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-extrabold hover:bg-amber-500/30 transition-colors"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Admin</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                  className="p-2 rounded-full text-zinc-400 hover:text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:inline-block px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-extrabold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/50 hover:scale-105 active:scale-95 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Deep Saturated Styling */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-white/10 bg-cinema-card/98 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl shadow-2xl"
            >
              {navLinks.map((link) => {
                if (link.authRequired && !isAuthenticated) return null;
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-brand-600 to-rose-700 text-white shadow-lg shadow-brand-600/40"
                        : "text-zinc-300 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}

              {isAuthenticated && user?.is_admin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30"
                >
                  <ShieldAlert className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* AI Search Dialog */}
      <NaturalSearchDialog open={aiModalOpen} onOpenChange={setAiModalOpen} />
    </>
  );
}
