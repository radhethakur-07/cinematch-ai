"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, Film, Compass, Bookmark, User, Search, LogOut, ShieldAlert, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { NaturalSearchDialog } from "@/components/ai/natural-search-dialog";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/home", label: "Home", icon: Film },
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/recommendations", label: "AI Recommendations", icon: Sparkles },
    { href: "/watchlist", label: "Watchlist", icon: Bookmark, authRequired: true },
    { href: "/profile", label: "Taste Profile", icon: User, authRequired: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-cinema-border/60 bg-cinema-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href={isAuthenticated ? "/home" : "/"} className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-accent p-1 shadow-lg shadow-brand-600/20 group-hover:scale-105 transition-transform">
              <Film className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-white via-zinc-200 to-brand-accent bg-clip-text text-transparent">
                CineMatch<span className="text-brand-500 text-xs ml-1 font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-brand-500/10 border border-brand-500/20">AI</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.authRequired && !isAuthenticated) return null;
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white bg-white/10"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-brand-500" : "text-zinc-400"}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Profile */}
          <div className="flex items-center gap-3">
            {/* Quick AI Mood Button */}
            <button
              onClick={() => setAiModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-600/20 to-cyan-500/20 border border-brand-500/30 text-zinc-200 hover:text-white text-xs font-semibold hover:border-brand-500/60 shadow-sm transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-500 animate-pulse" />
              <span className="hidden sm:inline">AI Mood Search</span>
            </button>

            {/* Direct Search Link */}
            <Link
              href="/search"
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Search Movies"
            >
              <Search className="h-4 w-4" />
            </Link>

            {/* Auth Buttons / Dropdown */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user?.is_admin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
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
                  className="p-2 rounded-full text-zinc-400 hover:text-brand-500 hover:bg-brand-500/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-md text-sm font-medium bg-brand-600 text-white hover:bg-brand-500 shadow-md shadow-brand-600/30 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-zinc-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-cinema-border bg-cinema-card px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              if (link.authRequired && !isAuthenticated) return null;
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-brand-600/20 text-brand-400" : "text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* AI Search Dialog */}
      <NaturalSearchDialog open={aiModalOpen} onOpenChange={setAiModalOpen} />
    </>
  );
}
