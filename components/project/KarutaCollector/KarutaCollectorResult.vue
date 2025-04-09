<template>
  <v-container class="app-result">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <div class="result-box">
          <p class="result-text">{{ gameStore.userName }}さんの結果</p>
          <p class="result-text">
            GETした札 … <strong>{{ gameStore.result }}枚</strong>
          </p>
          <p class="result-text">
            お手つきした数 … <strong>{{ gameStore.subResult }}回</strong>
          </p>
        </div>

        <v-progress-circular
          v-if="loading"
          indeterminate
          size="100"
          :width="9"
          color="primary"
          class="mx-auto"
        />

        <v-fade-transition>
          <div v-if="ready" class="result-box result-ranking">
            <p class="result-text">
              <template v-if="total > 0">
                {{ total }}人中
                <span class="text-primary result-rank"> {{ rank }}位 </span>!!
              </template>
              <template v-else> 次こそは札がとれるよ!! 頑張ろう!! </template>
            </p>

            <div v-if="posted">
              <KarutaButton class="mb-2" @click="goToRanking">
                <v-icon left>mdi-star</v-icon>
                ランキングを見る
              </KarutaButton>
              <KarutaButton @click="goToStart">
                <v-icon left>mdi-play</v-icon>
                スタート画面に戻る
              </KarutaButton>
            </div>

            <div v-else>
              <v-text-field
                v-model="feeling"
                label="感想を一言お願いします！"
                variant="outlined"
                density="comfortable"
                class="mb-2"
              />
              <KarutaButton @click="postFeeling">
                <v-icon left>mdi-send</v-icon>
                送信
              </KarutaButton>
            </div>
          </div>
        </v-fade-transition>
      </v-col>
    </v-row>

    <!-- サウンド -->
    <audio ref="drumRollSound" src="/sounds/roll.mp3" preload="auto" />
    <audio
      ref="congratulationSound1"
      src="/sounds/congratulation1.mp3"
      preload="auto"
    />
    <audio
      ref="congratulationSound2"
      src="/sounds/congratulation2.mp3"
      preload="auto"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useGameStore } from "@/stores/game";
import { addResult, getRank, setFeeling } from "@/services/api";
import KarutaButton from "@/components/parts/KarutaButton.vue";

// Store
const gameStore = useGameStore();

// State
const userId = ref("");
const rank = ref(0);
const total = ref(0);
const loading = ref(true);
const ready = ref(false);
const posted = ref(false);
const feeling = ref("");

// Audio Refs
const drumRollSound = ref<HTMLAudioElement | null>(null);
const congratulationSound1 = ref<HTMLAudioElement | null>(null);
const congratulationSound2 = ref<HTMLAudioElement | null>(null);

// Play audio
const playSound = (sound: HTMLAudioElement | null) => {
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
};

// Fetch results & play sound
const fetchResults = async () => {
  playSound(drumRollSound.value);

  if (gameStore.result > 0) {
    userId.value = await addResult(
      gameStore.userName,
      gameStore.result,
      gameStore.subResult
    );
  }

  if (!userId.value) {
    loading.value = false;
    ready.value = true;
    return;
  }

  const [rankResult, totalUsers] = await getRank(userId.value);
  rank.value = rankResult;
  total.value = totalUsers;

  loading.value = false;

  setTimeout(() => {
    if (rank.value === 1) {
      playSound(congratulationSound1.value);
    } else {
      playSound(congratulationSound2.value);
    }

    ready.value = true;
  }, 1500);
};

// 感想送信
const postFeeling = () => {
  posted.value = true;
  setFeeling(userId.value, feeling.value);
};

// 画面遷移
const goToRanking = () => gameStore.setGameStatus("RANKING");
const goToStart = () => gameStore.setGameStatus("START");

// Lifecycle
onMounted(fetchResults);
onBeforeUnmount(() => gameStore.resetGame());
</script>

<style scoped>
.app-result {
  text-align: center;
  padding-top: 2rem;
}

.result-box {
  margin-bottom: 2rem;
}

.result-text {
  font-size: 1.5rem;
  line-height: 1.8;
}

.result-ranking .result-rank {
  font-size: 2rem;
  font-weight: bold;
}
</style>
