"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "@/types";
import { api } from "@/lib/api-client";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  setUser: (user: UserProfile | null) => void;
  refreshUser: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res: any = await api.post("/auth/login", { email, password });
          if (res?.access_token) {
            localStorage.setItem("cinematch_auth_token", res.access_token);
            set({
              token: res.access_token,
              user: res.user,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      register: async (email, password, fullName) => {
        set({ isLoading: true });
        try {
          const res: any = await api.post("/auth/register", {
            email,
            password,
            full_name: fullName,
          });
          if (res?.access_token) {
            localStorage.setItem("cinematch_auth_token", res.access_token);
            set({
              token: res.access_token,
              user: res.user,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("cinematch_auth_token");
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      refreshUser: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const user: any = await api.get("/auth/me");
          set({ user, isAuthenticated: true });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: "cinematch_auth_store",
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
