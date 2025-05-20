import type { Pinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

export default defineNuxtPlugin(({ $pinia }) => {
  ($pinia as Pinia).use(piniaPluginPersistedstate);
});
