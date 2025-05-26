import { defineStore } from "pinia";
import type { PersistenceOptions } from "pinia-plugin-persistedstate";
import { login, signup } from "~/services/authApi";
import {
  getTokenFromCookie,
  setTokenToCookie,
  clearTokenCookie,
} from "@/utils/authCookie";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string;
  ready: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: "",
    ready: false,
  }),

  getters: {
    isLoggedIn: (state): boolean => !!state.user && !!state.token,
  },

  actions: {
    setUser(user: User, token: string): void {
      this.user = user;
      this.token = token;
      setTokenToCookie(token);
      this.ready = true;
    },

    clearUser(): void {
      this.user = null;
      this.token = "";
      clearTokenCookie();
      this.ready = true;
    },

    async login(email: string, password: string): Promise<void> {
      const { user, token } = await login({ email, password });
      this.setUser(user, token);
    },

    async signupAndLogin(
      name: string,
      email: string,
      password: string
    ): Promise<void> {
      await signup({ name, email, password });
      await this.login(email, password);
    },

    async restoreSession(): Promise<void> {
      try {
        const token = getTokenFromCookie();
        if (!token) {
          this.ready = true;
          return;
        }

        const {
          public: { apiBase },
        } = useRuntimeConfig();
        const me = await $fetch<User>(`${apiBase}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.setUser(me, token);
      } catch (e) {
        console.error("[restoreSession] error", e);
        this.clearUser();
      } finally {
        this.ready = true;
      }
    },
  },

  persist: {
    paths: ["user", "token"],
  } as PersistenceOptions,
});
