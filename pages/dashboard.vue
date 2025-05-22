<template>
  <v-container class="py-10 text-center">
    <h1 class="text-h5 mb-4">🎉 ダッシュボードへようこそ！</h1>
    <p>ログイン済みユーザーのみがアクセスできます。</p>

    <v-btn color="error" class="mt-6" @click="showDialog = true"
      >ログアウト</v-btn
    >
  </v-container>

  <BaseDialog
    v-model="showDialog"
    title="ログアウト確認"
    text="本当にログアウトしますか？"
    confirmLabel="ログアウト"
    cancelLabel="キャンセル"
    confirmColor="error"
    @confirm="logout"
  />
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import BaseDialog from "@/components/parts/BaseDialog.vue";

const auth = useAuthStore();

const showDialog = ref(false);

const logout = () => {
  auth.clearUser();
  navigateTo("/login");
};
</script>
