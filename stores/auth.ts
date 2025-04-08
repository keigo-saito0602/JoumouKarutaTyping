// stores/auth.ts
import { defineStore } from "pinia";

interface User {
  id: string;
  name: string;
  email: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: "" as string,
  }),
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
  },
});
