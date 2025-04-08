<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { useGameStore } from "@/stores/game";
import KarutaButton from "@/components/parts/KarutaButton.vue";
import { addResult, getRank, setFeeling } from "@/services/api";

export default defineComponent({
  name: "GameResult",
  components: { KarutaButton },
  setup() {
    const gameStore = useGameStore();

    const userId = ref("");
    const rank = ref(0);
    const total = ref(0);
    const loading = ref(true);
    const posted = ref(false);
    const feeling = ref("");

    // サウンド
    const drumRollSound = ref<HTMLAudioElement | null>(null);
    const congratulationSound1 = ref<HTMLAudioElement | null>(null);
    const congratulationSound2 = ref<HTMLAudioElement | null>(null);

    function playSound(sound: HTMLAudioElement | null) {
      if (sound) {
        sound.currentTime = 0;
        sound.play();
      }
    }

    async function fetchResults() {
      playSound(drumRollSound.value);
      if (gameStore.result > 0) {
        userId.value = await addResult(
          gameStore.userName,
          gameStore.result,
          gameStore.subResult
        );
      }
      const [rankResult, totalUsers] = await getRank(userId.value);
      rank.value = rankResult;
      total.value = totalUsers;

      setTimeout(() => {
        loading.value = false;
        if (rank.value === 1) {
          playSound(congratulationSound1.value);
        } else {
          playSound(congratulationSound2.value);
        }
      }, 1500);
    }

    function postFeeling() {
      posted.value = true;
      setFeeling(userId.value, feeling.value);
    }

    function goToRanking() {
      gameStore.setGameStatus("RANKING");
    }

    function goToStart() {
      gameStore.setGameStatus("START");
    }

    onMounted(fetchResults);

    onBeforeUnmount(() => {
      gameStore.resetGame();
    });

    return {
      userId,
      rank,
      total,
      loading,
      posted,
      feeling,
      drumRollSound,
      congratulationSound1,
      congratulationSound2,
      gameStore,
      postFeeling,
      goToRanking,
      goToStart,
    };
  },
});
</script>

<template>
  <v-container class="container">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <div class="result-window result-name">
          {{ gameStore.userName }}さんの結果
        </div>
        <div class="result-window result-result">
          GETした札 … {{ gameStore.result }}枚
        </div>
        <div class="result-window result-sub-result">
          お手つきした数 … {{ gameStore.subResult }}回
        </div>

        <div v-if="loading" class="fulfilling-square-spinner">
          <div class="spinner-inner" />
        </div>

        <template v-else>
          <div class="result-window result-rank">
            {{ total }}人中 <span class="result-strong">{{ rank }}位</span>!
          </div>

          <template v-if="posted">
            <KarutaButton class="app-button" @click="goToRanking">
              <v-icon left>mdi-star</v-icon>
              ランキングを見る
            </KarutaButton>
            <KarutaButton class="app-button" @click="goToStart">
              <v-icon left>mdi-play</v-icon>
              スタート画面に戻る
            </KarutaButton>
          </template>

          <template v-else>
            <div class="result-form">
              <v-text-field
                v-model="feeling"
                class="app-form"
                label="感想を一言お願いします！"
                outlined
                dense
              />
            </div>
            <KarutaButton class="app-button" @click="postFeeling">
              <v-icon left>mdi-send</v-icon>
              送信
            </KarutaButton>
          </template>
        </template>
      </v-col>
    </v-row>

    <!-- サウンド -->
    <audio ref="drumRollSound" src="/sounds/roll.mp3" preload="auto"></audio>
    <audio
      ref="congratulationSound1"
      src="/sounds/congratulation1.mp3"
      preload="auto"
    ></audio>
    <audio
      ref="congratulationSound2"
      src="/sounds/congratulation2.mp3"
      preload="auto"
    ></audio>
  </v-container>
</template>
