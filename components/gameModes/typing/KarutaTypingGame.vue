<template>
  <div class="container">
    <template v-if="state.isClear">
      <ResultController @retry="toStart" @result="toResult" />
    </template>
    <template v-else>
      <div class="timer-wrapper">
        <CircularTimer :duration="remainingTime" @onTimeUp="onTimeUp" />
      </div>
      <KartaDisplay :picturePath="state.currentPicturePath" />
      <TypingDisplay
        :text="state.currentQuestion.text"
        :yomi="state.currentQuestion.yomi"
        :viewIndexKana="state.viewIndexKana"
        :inputChar="state.inputChar"
        :userInput="state.userInput"
        :currentQuestionRome="state.currentQuestionRome"
      />
      <KartaComment :comment="state.currentQuestion.comment || ''" />
    </template>
  </div>
  <SoundPlayer ref="soundRef" />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import CircularTimer from "@/components/parts/CircularTimer.vue";
import KartaDisplay from "@/components/parts/game/KartaDisplay.vue";
import TypingDisplay from "@/components/parts/game/TypingDisplay.vue";
import KartaComment from "@/components/parts/game/KartaComment.vue";
import ResultController from "@/components/parts/game/ResultController.vue";
import SoundPlayer from "@/components/parts/SoundPlayer.vue";

import { useKarutaTypingGame } from "@/composables/useKarutaTypingGame";
import { useGameStore } from "@/stores/game";
import TIMER_OPTIONS from "@/constants/constants";

const remainingTime = TIMER_OPTIONS.TWO_MINUTES;
const gameStore = useGameStore();
const soundRef = ref<InstanceType<typeof SoundPlayer> | null>(null);

const { state, setupGame, setSoundFns } = useKarutaTypingGame();

onMounted(() => {
  setSoundFns({
    keyStroke: () => soundRef.value?.play("KEY_STROKE"),
    getCard: () => soundRef.value?.play("GET_CARD"),
    failed: () => soundRef.value?.play("FAILED"),
    end: () => soundRef.value?.play("WHISTLE"),
  });
});

const toResult = () => {
  gameStore.setGameStatus("RESULT");
};

const toStart = () => {
  if (state.timerId) clearTimeout(state.timerId);
  gameStore.resetGame();
  state.isClear = false;
  setupGame();
};

const onTimeUp = () => {
  soundRef.value?.play("WHISTLE");
  if (state.timerId !== null) {
    clearTimeout(state.timerId);
    state.timerId = null;
  }
  gameStore.setPlayTimeText("");
  state.isClear = true;
};
</script>

<style scoped lang="scss">
.container {
  position: relative;
}

.timer-wrapper {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
}
</style>
