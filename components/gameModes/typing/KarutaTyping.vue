<template>
  <v-container>
    <main>
      <template v-if="gameStore.gameStatus === 'START'">
        <KarutaCollectorStart />
      </template>
      <template v-else-if="gameStore.gameStatus === 'PLAYING'">
        <KarutaCollectorGame />
      </template>
      <template v-else-if="gameStore.gameStatus === 'RESULT'">
        <KarutaCollectorResult />
      </template>
    </main>
  </v-container>
</template>

<script setup lang="ts">
import { useGameStore } from "@/stores/game";

import KarutaCollectorStart from "~/components/gameModes/typing/KarutaTypingGameStart.vue";
import KarutaCollectorGame from "~/components/gameModes/typing/KarutaTypingGame.vue";
import KarutaCollectorResult from "~/components/gameModes/typing/KarutaTypingGameResult.vue";

const gameStore = useGameStore();
</script>

<style scoped>
main {
  text-align: center;
  padding: 1em;
  max-width: 240px;
  margin: 0 auto;
}
@media (min-width: 640px) {
  main {
    max-width: none;
    height: calc(100% - 2rem - 90px);
  }
}
.google-logo {
  width: 250px;
  margin-top: 27vh;
}
</style>
