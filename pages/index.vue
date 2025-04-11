<template>
  <v-container class="text-center mt-16">
    <h1 class="text-h4 font-weight-bold mb-6">ようこそ！</h1>

    <BaseButton
      label="ゲームで遊ぶ"
      color="primary"
      size="large"
      icon="mdi-gamepad-variant"
      @click="goToTypingGame"
      class="mb-4"
    />

    <p class="text-body-1 text-grey">タイピングで札を集めよう！</p>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import BaseButton from "@/components/parts/BaseButton.vue";

const router = useRouter();

const goToTypingGame = () => {
  router.push("/game");
};
</script>
