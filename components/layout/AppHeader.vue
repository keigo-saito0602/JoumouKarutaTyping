<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>{{ $t("app.name") }}</v-toolbar-title>
    <v-spacer />
    {{ gameStore.gameStatus }}
    <template v-if="auth.isLoggedIn">
      <NuxtLink to="/dashboard" class="mx-2">
        <BaseButton
          :label="$t('header.dashboard')"
          color="white"
          variant="outlined"
        />
      </NuxtLink>
      <template v-if="gameStore.gameStatus === 'PLAYING'">
        <div class="text-h6 font-weight-medium">
          {{ gameStore.result }}枚 GET!
        </div>
      </template>
      <template
        v-else-if="['RANKING', 'RESULT'].includes(gameStore.gameStatus)"
      >
        <BaseButton
          icon="mdi-home"
          label="スタート画面"
          color="primary"
          variant="outlined"
          @click="toTop"
        />
      </template>
      <template v-else-if="gameStore.gameStatus === 'START'">
        <BaseButton
          icon="mdi-star"
          label="ランキングを見る"
          color="primary"
          variant="outlined"
          @click="toRanking"
        />
      </template>
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
import { useGameStore } from "@/stores/game";
import BaseButton from "~/components/parts/BaseButton.vue";

const gameStore = useGameStore();
const auth = useAuthStore();

const toTop = () => {
  gameStore.setGameStatus("START");
};

const toRanking = () => {
  gameStore.setGameStatus("RANKING");
};
</script>

<style scoped lang="scss">
.v-app-bar {
  height: 64px; /* Adjust the height of the header */
  padding: 0;
  position: sticky;
  top: 0;
}

.karuta-header {
  font-weight: bold;
  font-size: 18px;
}

.font-mono {
  font-family: "Courier New", Courier, monospace;
}

.v-spacer {
  margin-right: 0; /* Adjust spacer margin if necessary */
}
</style>
