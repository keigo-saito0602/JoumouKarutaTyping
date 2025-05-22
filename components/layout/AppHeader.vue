<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>
      {{ $t("app.name") }}
    </v-toolbar-title>

    <v-spacer />

    <BaseButton
      v-if="showHomeButton"
      icon="mdi-home"
      label="ホーム画面"
      color="white"
      variant="text"
      class="mx-2"
      @click="goToHome"
    />

    <BaseButton
      v-if="showTopButton"
      icon="mdi-home"
      label="スタート画面"
      color="white"
      variant="text"
      class="mx-2"
      @click="toGameStart"
    />

    <BaseButton
      v-if="showRankingButton"
      icon="mdi-star"
      label="ランキングを見る"
      color="white"
      variant="text"
      class="mx-2"
      @click="toRanking"
    />

    <client-only>
      <template v-if="ready">
        <template v-if="isLoggedIn">
          <v-chip
            v-if="isPlaying"
            color="white"
            text-color="primary"
            variant="flat"
            class="mx-2"
          >
            {{ result }}枚 GET!
          </v-chip>

          <BaseButton
            :label="$t('header.dashboard')"
            color="white"
            variant="flat"
            class="mx-2"
            @click="goToDashboard"
          />
        </template>

        <template v-else>
          <BaseButton
            label="ログイン"
            color="white"
            variant="outlined"
            class="mx-2"
            @click="goToLogin"
          />
          <BaseButton
            label="新規登録"
            color="white"
            variant="outlined"
            class="mx-2"
            @click="goToSignup"
          />
        </template>
      </template>
    </client-only>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";
import { useGameStore } from "@/stores/game";
import { GAME_STATUS } from "@/constants/game";
import BaseButton from "~/components/parts/BaseButton.vue";

const auth = useAuthStore();
const { user, ready } = storeToRefs(auth);
const isLoggedIn = computed(() => !!user.value);

const gameStore = useGameStore();
const router = useRouter();
const route = useRoute();

const result = computed(() => gameStore.result);
const gameStatus = computed(() => gameStore.gameStatus);

const isPlaying = computed(() => gameStatus.value === GAME_STATUS.PLAYING);
const isStart = computed(() => gameStatus.value === GAME_STATUS.START);
const isResult = computed(() => gameStatus.value === GAME_STATUS.RESULT);

const showHomeButton = computed(() => isStart.value && route.path !== "/");
const showRankingButton = computed(
  () => isStart.value && route.path !== "/ranking"
);
const showTopButton = computed(() => isResult.value);

const goToHome = () => router.push("/");
const goToDashboard = () => router.push("/dashboard");
const goToLogin = () => router.push("/login");
const goToSignup = () => router.push("/signup");
const toGameStart = () => gameStore.setGameStatus(GAME_STATUS.START);
const toRanking = () => router.push("/ranking");
</script>

<style scoped lang="scss">
.v-app-bar {
  height: 64px;
  padding: 0;
  position: sticky;
  top: 0;
}

.v-spacer {
  margin-right: 0;
}
</style>
