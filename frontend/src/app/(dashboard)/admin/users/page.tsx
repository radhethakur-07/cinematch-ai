"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Users, ArrowLeft, Loader2, ShieldAlert, Star, Bookmark } from "lucide-react";

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
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-cinema-border/80 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-lg border border-cinema-border bg-cinema-card text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="h-6 w-6 text-cyan-400" />
              User Management & Profiles
            </h1>
            <p className="text-xs text-zinc-400">Registered platform accounts and rating engagement</p>
          </div>
        </div>

        <span className="text-xs text-zinc-300 font-semibold bg-cinema-card border border-cinema-border px-3 py-1.5 rounded-lg">
          {users?.length || 0} Registered Users
        </span>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
          <p className="text-sm text-zinc-400">Loading user profiles...</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-cinema-border bg-cinema-card shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-black/40 text-zinc-400 font-semibold border-b border-cinema-border">
                <tr>
                  <th className="p-4">User ID</th>
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Ratings Count</th>
                  <th className="p-4">Watchlist Count</th>
                  <th className="p-4">Onboarding</th>
                  <th className="p-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cinema-border/50">
                {users?.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-zinc-400 truncate max-w-[120px]">{u.id}</td>
                    <td className="p-4 font-semibold text-white">{u.full_name || "Anonymous User"}</td>
                    <td className="p-4 text-zinc-300">{u.email}</td>
                    <td className="p-4">
                      {u.is_admin ? (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                          <ShieldAlert className="h-3 w-3" /> Admin
                        </span>
                      ) : (
                        <span className="text-zinc-500">Member</span>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-amber-400">{u.ratings_count || 0}</td>
                    <td className="p-4 font-semibold text-cyan-400">{u.watchlist_count || 0}</td>
                    <td className="p-4">
                      {u.onboarding_completed ? (
                        <span className="text-emerald-400 font-semibold">Done</span>
                      ) : (
                        <span className="text-zinc-500">Pending</span>
                      )}
                    </td>
                    <td className="p-4 text-zinc-400">{new Date(u.created_at).toLocaleDateString()}</td>
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
