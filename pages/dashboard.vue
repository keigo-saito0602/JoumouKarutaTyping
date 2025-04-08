<template>
  <v-container class="py-10 text-center">
    <h1 class="text-h5 mb-4">🎉 ダッシュボードへようこそ！</h1>
    <p>ログイン済みユーザーのみがアクセスできます。</p>

    <v-btn color="error" class="mt-6" @click="logout">ログアウト</v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";

const router = useRouter();
const auth = useAuthStore();

const logout = () => {
  auth.clearUser();
  navigateTo("/login");
};
</script>
