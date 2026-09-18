"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, Film, Compass, Bookmark, User, Search, LogOut, ShieldAlert, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { NaturalSearchDialog } from "@/components/ai/natural-search-dialog";
import { ThemeToggle } from "@/components/theme/theme-toggle";
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
      <header className="sticky top-0 z-40 w-full border-b border-cinema-border bg-cinema-void/90 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link href={isAuthenticated ? "/home" : "/"} className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-crimson text-white shadow-subtle group-hover:bg-crimson-hover transition-colors">
              <Film className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-lg tracking-tight text-cinema-text">
                CineMatch
              </span>
              <span className="text-[11px] font-semibold text-crimson tracking-wider uppercase px-1.5 py-0.5 rounded bg-crimson-soft border border-crimson/20">
                AI
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
                    isActive
                      ? "text-cinema-text bg-cinema-elevated font-semibold border border-cinema-border"
                      : "text-cinema-secondary hover:text-cinema-text hover:bg-cinema-hover"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-crimson" : "text-cinema-muted"}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick AI Search Trigger */}
            <button
              onClick={() => setAiModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-cinema-surface hover:bg-cinema-hover border border-cinema-border text-cinema-text text-xs font-medium transition-colors cursor-pointer"
              title="Natural Language Search"
            >
              <Sparkles className="h-3.5 w-3.5 text-crimson" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Direct Search Link */}
            <Link
              href="/search"
              className="p-2 rounded-control text-cinema-secondary hover:text-cinema-text hover:bg-cinema-hover border border-transparent hover:border-cinema-border transition-colors"
              title="Search Movies"
            >
              <Search className="h-4 w-4" />
            </Link>

            {/* Global Theme Toggle */}
            <ThemeToggle />

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user?.is_admin && (
                  <Link
                    href="/admin"
                    className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-control bg-cinema-elevated border border-cinema-border text-gold text-xs font-medium hover:bg-cinema-hover transition-colors"
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
                  className="p-2 rounded-control text-cinema-muted hover:text-semantic-danger hover:bg-semantic-danger/10 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:inline-block px-3 py-1.5 rounded-btn text-xs font-medium text-cinema-secondary hover:text-cinema-text hover:bg-cinema-hover transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-btn text-xs font-semibold bg-crimson hover:bg-crimson-hover text-white shadow-subtle transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-control text-cinema-secondary hover:text-cinema-text hover:bg-cinema-hover"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-cinema-border bg-cinema-surface px-4 pt-2 pb-5 space-y-1"
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
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-control text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-cinema-elevated text-cinema-text font-semibold border border-cinema-border"
                        : "text-cinema-secondary hover:bg-cinema-hover hover:text-cinema-text"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-crimson" : "text-cinema-muted"}`} />
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-2 pb-1 border-t border-cinema-border-subtle flex items-center justify-between px-3.5">
                <span className="text-xs font-medium text-cinema-muted">Appearance</span>
                <ThemeToggle showLabel={true} />
              </div>

              {isAuthenticated && user?.is_admin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-control text-sm font-medium text-gold bg-cinema-elevated border border-cinema-border"
                >
                  <ShieldAlert className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* AI Natural Search Dialog */}
      <NaturalSearchDialog open={aiModalOpen} onOpenChange={setAiModalOpen} />
    </>
  );
}
