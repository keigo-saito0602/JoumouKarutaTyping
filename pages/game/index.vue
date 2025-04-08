<template>
  <v-container class="text-center mt-10">
    <h1 class="text-h4 font-weight-bold mb-6">モードを選択してください</h1>
    <v-row justify="center" align="center">
      <v-col cols="12" md="4">
        <BaseButton
          label="カルタコレクター"
          color="primary"
          @click="goToMode('karutaCollector')"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import BaseButton from "@/components/parts/BaseButton.vue";

const router = useRouter();

const goToMode = (mode: string) => {
  router.push(`/game/${mode}`);
};
</script>
