<template>
  <v-app v-if="authReady">
    <AppHeader />

    <FlashMessage />

    <v-main>
      <NuxtPage />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";
import AppHeader from "~/components/layout/AppHeader.vue";
import AppFooter from "~/components/layout/AppFooter.vue";
import FlashMessage from "~/components/parts/FlashMessage.vue";

const auth = useAuthStore();
const { ready: authReady } = storeToRefs(auth);
</script>
