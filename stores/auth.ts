import { defineStore } from "pinia";
import { login } from "@/utils/authApi";
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

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: "",
    ready: false,
  }),
  persist: true,
  getters: {
    isLoggedIn: (state) => !!state.user && !!state.token,
  },
  actions: {
    setUser(user: User, token: string) {
      this.user = user;
      this.token = token;
      setTokenToCookie(token);
    },
    clearUser() {
      this.user = null;
      this.token = "";
      clearTokenCookie();
    },
    async login(email: string, password: string) {
      const { user, token } = await login({ email, password });
      this.setUser(user, token);
    },
    async restoreSession() {
      const token = getTokenFromCookie();
      if (!token) return;

      try {
        const config = useRuntimeConfig();
        const me = await $fetch<User>(`${config.public.apiBase}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.setUser(me, token);
      } catch (e) {
        console.error("[restoreSession] error", e);
        this.clearUser();
      }
    },
  },
});
