<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>{{ $t("app.name") }}</v-toolbar-title>
    <v-spacer />
    <NuxtLink to="/" class="mx-2">
      <BaseButton :label="$t('header.home')" color="white" variant="outlined" />
    </NuxtLink>

    <template v-if="auth.isLoggedIn">
      <NuxtLink to="/dashboard" class="mx-2">
        <BaseButton
          :label="$t('header.dashboard')"
          color="white"
          variant="outlined"
        />
      </NuxtLink>
    </template>
    <template v-else>
      <NuxtLink to="/login" class="mx-2">
        <BaseButton
          :label="$t('header.login')"
          color="white"
          variant="outlined"
        />
      </NuxtLink>
      <NuxtLink to="/signup" class="mx-2">
        <BaseButton
          :label="$t('header.signup')"
          color="white"
          variant="outlined"
        />
      </NuxtLink>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import BaseButton from "@/components/parts/BaseButton.vue";

const auth = useAuthStore();
</script>
