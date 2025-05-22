import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  const PUBLIC_PATHS = [
    /^\/$/,
    /^\/login$/,
    /^\/signup$/,
    /^\/ranking$/,
    /^\/game(\/.*)?$/,
  ];

  const isPublicPath = PUBLIC_PATHS.some((regex) => regex.test(to.path));

  if (!auth.isLoggedIn && !isPublicPath) {
    return navigateTo("/login");
  }
});
