<template>
  <component :is="currentGameComponent" v-if="currentGameComponent" />
  <v-container v-else class="text-center mt-10">
    <v-alert type="error" color="error" variant="tonal">
      無効なモードです。スタート画面に戻ってください。
    </v-alert>
    <div class="mt-4">
      <BaseButton label="スタート画面へ" color="primary" @click="goHome" />
    </div>
    <div class="mt-4">
      <BaseButton color="error" class="mt-6" @click="logout"
        >ログアウト</BaseButton
      >
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { useGameStore } from "@/stores/game";
import BaseButton from "@/components/parts/BaseButton.vue";
import KarutaCollectorApp from "~/components/gameModes/typing/KarutaTyping.vue";

const auth = useAuthStore();
const gameStore = useGameStore();

const route = useRoute();
const router = useRouter();

const logout = () => {
  auth.clearUser();
  router.push("/login");
};

const modeId = Array.isArray(route.params.modeId)
  ? route.params.modeId[0]
  : route.params.modeId;

const resolveComponent = (mode: string) => {
  switch (mode) {
    case "karutaCollector":
      return KarutaCollectorApp;
    default:
      return null;
  }
};

const currentGameComponent = computed(() => resolveComponent(modeId));

onMounted(() => {
  gameStore.setGameStatus("START");
});

const goHome = () => {
  router.push("/");
};
</script>
