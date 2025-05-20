export default defineNuxtPlugin(async () => {
  const auth = useAuthStore();
  const token = useCookie("token").value;

  if (!auth.isLoggedIn && token && !auth.user) {
    await auth.restoreSession();
  }
});
