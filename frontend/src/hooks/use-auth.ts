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
  isHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  setUser: (user: UserProfile | null) => void;
  refreshUser: () => Promise<void>;
}

// Helper to get initial state synchronously from localStorage on client side
const getInitialAuthState = () => {
  if (typeof window === "undefined") {
    return { token: null, user: null, isAuthenticated: false };
  }
  try {
    const rawToken = localStorage.getItem("cinematch_auth_token");
    const rawStore = localStorage.getItem("cinematch_auth_store");
    if (rawStore) {
      const parsed = JSON.parse(rawStore);
      const state = parsed?.state;
      if (state?.token && state?.user) {
        return {
          token: state.token as string,
          user: state.user as UserProfile,
          isAuthenticated: Boolean(state.isAuthenticated ?? true),
        };
      }
    }
    if (rawToken) {
      return { token: rawToken, user: null, isAuthenticated: true };
    }
  } catch {}
  return { token: null, user: null, isAuthenticated: false };
};

const initialAuth = getInitialAuthState();

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: initialAuth.user,
      token: initialAuth.token,
      isAuthenticated: initialAuth.isAuthenticated,
      isLoading: false,
      isHydrated: typeof window !== "undefined",

      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res: any = await api.post("/auth/login", { email, password });
          if (res?.access_token) {
            if (typeof window !== "undefined") {
              localStorage.setItem("cinematch_auth_token", res.access_token);
            }
            set({
              token: res.access_token,
              user: res.user,
              isAuthenticated: true,
              isLoading: false,
              isHydrated: true,
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
            if (typeof window !== "undefined") {
              localStorage.setItem("cinematch_auth_token", res.access_token);
            }
            set({
              token: res.access_token,
              user: res.user,
              isAuthenticated: true,
              isLoading: false,
              isHydrated: true,
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
          localStorage.removeItem("cinematch_auth_store");
        }
        set({ user: null, token: null, isAuthenticated: false, isLoading: false, isHydrated: true });
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      refreshUser: async () => {
        let token = get().token;
        if (!token && typeof window !== "undefined") {
          token = localStorage.getItem("cinematch_auth_token");
          if (!token) {
            try {
              const rawStore = localStorage.getItem("cinematch_auth_store");
              if (rawStore) {
                const parsed = JSON.parse(rawStore);
                token = parsed?.state?.token || null;
              }
            } catch {}
          }
        }

        if (!token) {
          set({ isHydrated: true, isLoading: false });
          return;
        }

        // Ensure token & isAuthenticated are set in store
        if (!get().token || !get().isAuthenticated) {
          set({ token, isAuthenticated: true });
        }

        try {
          const user: any = await api.get("/auth/me");
          if (user && user.id) {
            set({ user, isAuthenticated: true, isHydrated: true, isLoading: false });
          }
        } catch (err: any) {
          console.warn("[Auth] refreshUser notice:", err);
          const errMsg = String(err?.message || "").toLowerCase();
          const isExplicitUnauthorized =
            errMsg.includes("401") ||
            errMsg.includes("unauthorized") ||
            errMsg.includes("invalid_token") ||
            errMsg.includes("invalid or expired");

          if (isExplicitUnauthorized) {
            console.warn("[Auth] Token rejected as invalid/expired by backend. Logging out.");
            get().logout();
          } else {
            // Keep user session active across network blips, cold starts, and timeouts
            set({ isHydrated: true, isLoading: false });
          }
        }
      },
    }),
    {
      name: "cinematch_auth_store",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
          if (state.token && typeof window !== "undefined") {
            localStorage.setItem("cinematch_auth_token", state.token);
          }
        }
      },
    }
  )
);
