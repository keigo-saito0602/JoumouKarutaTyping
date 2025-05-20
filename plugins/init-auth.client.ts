export default defineNuxtPlugin(async () => {
  const auth = useAuthStore();
  const token = useCookie("token").value;

  if (!auth.user && token) {
    await auth.restoreSession();
  }
  auth.ready = true;
});
