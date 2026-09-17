"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Users, ArrowLeft, Loader2, ShieldAlert } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  is_admin: boolean;
  onboarding_completed: boolean;
  ratings_count: number;
  watchlist_count: number;
  created_at: string;
}

export default function AdminUsersPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => api.get<AdminUser[]>("/admin/users"),
  });

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex items-center justify-between border-b border-cinema-border pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-lg border border-cinema-border bg-cinema-surface text-cinema-muted hover:text-cinema-text transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-cinema-text flex items-center gap-2">
              <Users className="h-5 w-5 text-crimson" />
              User Profiles & Engagement
            </h1>
            <p className="text-xs text-cinema-muted">Registered platform accounts and rating engagement</p>
          </div>
        </div>

        <span className="text-xs text-cinema-muted font-medium bg-cinema-surface border border-cinema-border px-3 py-1.5 rounded-lg">
          {users?.length || 0} Registered Users
        </span>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-6 w-6 text-crimson animate-spin" />
          <p className="text-sm text-cinema-muted">Loading user profiles...</p>
        </div>
      ) : (
        <div className="rounded-xl border border-cinema-border bg-cinema-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-cinema-secondary">
              <thead className="bg-cinema-elevated text-cinema-muted font-medium border-b border-cinema-border">
                <tr>
                  <th className="p-3.5">User ID</th>
                  <th className="p-3.5">Full Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Ratings</th>
                  <th className="p-3.5">Watchlist</th>
                  <th className="p-3.5">Onboarding</th>
                  <th className="p-3.5">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cinema-border-subtle">
                {users?.map((u) => (
                  <tr key={u.id} className="hover:bg-cinema-hover transition-colors">
                    <td className="p-3.5 font-mono text-cinema-muted truncate max-w-[120px]">{u.id}</td>
                    <td className="p-3.5 font-medium text-cinema-text">{u.full_name || "Anonymous User"}</td>
                    <td className="p-3.5 text-cinema-muted">{u.email}</td>
                    <td className="p-3.5">
                      {u.is_admin ? (
                        <span className="inline-flex items-center gap-1 rounded bg-crimson/10 border border-crimson/30 px-2 py-0.5 text-[10px] font-semibold text-crimson">
                          <ShieldAlert className="h-3 w-3" /> Admin
                        </span>
                      ) : (
                        <span className="text-cinema-muted">Member</span>
                      )}
                    </td>
                    <td className="p-3.5 font-medium text-gold">{u.ratings_count || 0}</td>
                    <td className="p-3.5 font-medium text-cinema-secondary">{u.watchlist_count || 0}</td>
                    <td className="p-3.5">
                      {u.onboarding_completed ? (
                        <span className="text-emerald-400 font-medium">Done</span>
                      ) : (
                        <span className="text-cinema-muted">Pending</span>
                      )}
                    </td>
                    <td className="p-3.5 text-cinema-muted">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
