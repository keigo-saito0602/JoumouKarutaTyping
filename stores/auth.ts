import { defineStore } from "pinia";
import { login } from "@/utils/authApi";

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
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    setUser(user: User, token: string) {
      this.user = user;
      this.token = token;
      const tokenCookie = useCookie("token");
      tokenCookie.value = token;
    },
    clearUser() {
      this.user = null;
      this.token = "";
      const tokenCookie = useCookie("token");
      tokenCookie.value = null;
    },
    async login(email: string, password: string) {
      const { user, token } = await login({ email, password });
      this.setUser(user, token);
    },
    async restoreSession() {
      if (!this.token) return;

      try {
        const config = useRuntimeConfig();
        const me = await $fetch<{ user_id: number }>(
          `${config.public.apiBase}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        this.setUser(
          {
            id: me.user_id.toString(),
            name: "ユーザー",
            email: "",
          },
          this.token
        );
      } catch (e) {
        console.error("[restoreSession] error", e);
        this.clearUser();
      }
    },
  },
});
