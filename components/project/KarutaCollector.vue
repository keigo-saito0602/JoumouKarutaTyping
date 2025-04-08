<template>
  <v-container>
    <main>
      <template v-if="!gameStore.isLogin">
        <img
          class="google-logo"
          src="/logos/google-logo.gif"
          alt="Please login"
        />
      </template>
      <template v-else-if="gameStore.gameStatus === 'START'">
        <KarutaCollectorStart />
      </template>
      <template v-else-if="gameStore.gameStatus === 'PLAYING'">
        <KarutaCollectorGame />
      </template>
      <template v-else-if="gameStore.gameStatus === 'RESULT'">
        <KarutaCollectorResult />
      </template>
      <template v-else-if="gameStore.gameStatus === 'RANKING'">
        <KarutaCollectorRanking />
      </template>
    </main>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useGameStore } from "@/stores/game";

import KarutaHeader from "@/components/layout/AppHeader.vue";
import KarutaCollectorStart from "@/components/project/KarutaCollector/KarutaCollectorStart.vue";
import KarutaCollectorGame from "@/components/project/KarutaCollector/KarutaCollectorGame.vue";
import KarutaCollectorResult from "@/components/project/KarutaCollector/KarutaCollectorResult.vue";
import KarutaCollectorRanking from "@/components/project/KarutaCollector/KarutaCollectorRanking.vue";

const gameStore = useGameStore();

onMounted(() => {
  if (!gameStore.isLogin) {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const userName = result.user?.displayName || "Guest";
        gameStore.setLogin(true, userName);
      })
      .catch((error) => {
        console.error("Login Error:", error.message);
      });
  }
});
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
