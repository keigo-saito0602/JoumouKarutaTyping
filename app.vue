<template>
  <v-app>
    <AppHeader />

    <v-main>
      <NuxtPage />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup lang="ts">
import AppHeader from "~/components/layout/AppHeader.vue";
import AppFooter from "~/components/layout/AppFooter.vue";

import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
onMounted(() => {
  auth.init();
});

// const auth = useAuthStore();

// onMounted(async () => {
//   const token = useCookie("token").value;

//   if (!auth.isLoggedIn && token && !auth.user) {
//     await auth.restoreSession();
//   }
// });
</script>
