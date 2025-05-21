<template>
  <v-app>
    <AppHeader />

    <FlashMessage />

    <v-main>
      <NuxtPage />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup lang="ts">
import AppHeader from "~/components/layout/AppHeader.vue";
import AppFooter from "~/components/layout/AppFooter.vue";
import FlashMessage from "~/components/parts/FlashMessage.vue";
</script>
