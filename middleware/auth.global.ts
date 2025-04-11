import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  const token = useCookie("token");

  const PUBLIC_PATHS = ["/", "/login", "/signup", "/ranking"];

  if (PUBLIC_PATHS.includes(to.path)) return;

  if (!auth.isLoggedIn && !token.value) {
    return navigateTo("/login");
  }

  // Cookieがあればストアに復元（※ここは本来APIで検証する）
  if (!auth.isLoggedIn && token.value) {
    // TODO: 本来はここで token 検証＋ユーザー取得API呼び出しする
    // ここでは仮ユーザーを直接復元する（デモ用）
    auth.setUser(
      {
        id: "123",
        name: "仮ユーザー",
        email: "test@example.com",
      },
      token.value
    );
  }
});
