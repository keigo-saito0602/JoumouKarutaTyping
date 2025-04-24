// import { useAuthStore } from "~/stores/auth";

// export default defineNuxtRouteMiddleware(async (to) => {
//   const auth = useAuthStore();
//   const token = useCookie("token").value;

//   const PUBLIC_PATHS = [
//     "/",
//     "/login",
//     "/signup",
//     "/ranking",
//     "/game",
//     "/game/karutaCollector",
//   ];

//   if (!auth.isLoggedIn && token) {
//     try {
//       await auth.restoreSession();
//     } catch {
//       auth.clearUser();
//     }
//   }

//   if (!auth.isLoggedIn && !PUBLIC_PATHS.includes(to.path)) {
//     return navigateTo("/login");
//   }
// });

import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const DISABLE_LOGIN = true;

  if (DISABLE_LOGIN && ["/login", "/signup", "/dashboard"].includes(to.path)) {
    return navigateTo("/");
  }

  const auth = useAuthStore();
  const token = useCookie("token").value;

  const PUBLIC_PATHS = ["/", "/ranking", "/game", "/game/karutaCollector"];

  if (!DISABLE_LOGIN) {
    if (!auth.isLoggedIn && token) {
      try {
        await auth.restoreSession();
      } catch {
        auth.clearUser();
      }
    }

    if (!auth.isLoggedIn && !PUBLIC_PATHS.includes(to.path)) {
      return navigateTo("/login");
    }
  }
});
