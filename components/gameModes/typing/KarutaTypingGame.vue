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
      <KartaComment :comment="state.currentQuestion.comment" />
    </template>
  </div>
  <SoundPlayer ref="soundRef" />
</template>

<script setup lang="ts">
import KartaDisplay from "@/components/parts/game/KartaDisplay.vue";
import TypingDisplay from "@/components/parts/game/TypingDisplay.vue";
import ResultController from "~/components/parts/game/ResultController.vue";
import KartaComment from "@/components/parts/game/KartaComment.vue";
import CircularTimer from "@/components/parts/CircularTimer.vue";
import SoundPlayer from "@/components/parts/SoundPlayer.vue";
import TIMER_OPTIONS from "@/constants/constants";
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { CHAR_TABLE } from "~/constants/TypingData";
import { getCards } from "@/services/api";
import { checkSmallHira, checkAfterN } from "@/utils/kanaUtils";
import { shuffleList } from "@/utils/gameUtils";
import { useGameStore } from "@/stores/game";

const gameStore = useGameStore();
const remainingTime = TIMER_OPTIONS.TEN_SECONDS;

const state = reactive({
  cardList: [] as any[],
  randomCardList: [] as any[],
  listIndex: 0,
  currentQuestion: {} as any,
  currentQuestionIndex: 0,
  currentQuestionRome: "",
  inputChar: "",
  userInput: "",
  isClear: false,
  currentPicturePath: "",
  cancelN: false,
  viewIndex: 0,
  viewIndexKana: 0,
  scopeArray: [] as string[],
  offset: 0,
  startTime: 0,
  limitTime: 0,
  timerId: null as any,
});

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  setFirstQuestion();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  if (state.timerId) clearTimeout(state.timerId);
});

const toResult = () => {
  gameStore.setGameStatus("RESULT");
};

const soundRef = ref<InstanceType<typeof SoundPlayer> | null>(null);

const playEndSound = () => {
  soundRef.value?.play("WHISTLE");
};

const playKeyStroke = () => {
  soundRef.value?.play("KEY_STROKE");
};

const playGetCard = () => {
  soundRef.value?.play("GET_CARD");
};

const playFailed = () => {
  soundRef.value?.play("FAILED");
};

const toStart = () => {
  if (state.timerId) clearTimeout(state.timerId);
  gameStore.resetGame();
  state.isClear = false;
};

const onTimeUp = () => {
  playEndSound();
  clearTimeout(state.timerId);
  gameStore.setPlayTimeText("");
  state.isClear = true;
};

const handleKeydown = (e: KeyboardEvent) => {
  e.preventDefault();
  playKeyStroke();

  const judged = judgeInputChar(e.key);
  if (judged === 0) {
    success();
  }
};

const setFirstQuestion = async () => {
  const r = await getCards();
  state.cardList = r;
  state.randomCardList = shuffleList(state.cardList);
  playGetCard();
  setQuestion();
};

const setQuestion = () => {
  state.currentQuestion = state.randomCardList[state.listIndex];
  state.currentPicturePath = `/cards/${state.currentQuestion.picture_card}`;
  updateScopeArray();
  showGuide();
};

const judgeInputChar = (chr: string): number | boolean => {
  state.offset = 0;

  if (handleSpecialN(chr)) return true;

  state.userInput += chr.toUpperCase();
  const yomi = state.currentQuestion?.yomi || "";

  if (!yomi || state.currentQuestionIndex >= yomi.length) return false;

  let hiragana = yomi[state.currentQuestionIndex];
  hiragana = handleSmallHira(yomi, hiragana);
  hiragana = handleN(yomi, hiragana);

  const neededChars = CHAR_TABLE[hiragana];
  if (!neededChars) return false;

  for (const pattern of neededChars) {
    if (pattern.startsWith(state.userInput)) {
      if (pattern === state.userInput) {
        state.inputChar += state.userInput;
        state.viewIndex++;
        state.currentQuestionIndex += hiragana.length;
        state.userInput = "";

        if (state.currentQuestionIndex >= yomi.length) {
          return 0;
        }

        showGuide();
        return true;
      } else {
        // 入力継続
        return true;
      }
    }
  }

  playFailed();
  gameStore.setSubResult(gameStore.subResult + 1);
  state.userInput = "";
  return false;
};

// nの特殊処理
const handleSpecialN = (chr: string) => {
  if (state.cancelN) {
    state.cancelN = false;
    if (chr === "n") {
      state.inputChar += chr.toUpperCase();
      return true;
    }
  }
  return false;
};

// ひらがなや小文字を処理する
const handleSmallHira = (yomi: string, hiragana: string): string => {
  let margin = 1;
  if (
    hiragana === "っ" ||
    checkSmallHira(yomi, state.currentQuestionIndex, margin)
  ) {
    const nextChar = yomi[state.currentQuestionIndex + margin];
    if (nextChar) {
      hiragana += nextChar;
      margin++;
      if (
        hiragana.startsWith("っ") &&
        checkSmallHira(yomi, state.currentQuestionIndex, margin)
      ) {
        hiragana += yomi[state.currentQuestionIndex + margin];
        margin++;
      }
    }
  }
  return hiragana;
};

// んの処理
const handleN = (yomi: string, hiragana: string): string => {
  if (hiragana === "ん" && !checkAfterN(yomi, state.currentQuestionIndex)) {
    hiragana = "ン";
    state.cancelN = true;
  }
  return hiragana;
};

// 入力が正しいか判定
const isCorrectInput = (neededChars: string[]): boolean | undefined => {
  if (neededChars.includes(state.userInput)) return true;

  const prefixMatch = neededChars.some((value) =>
    value.startsWith(state.userInput)
  );
  if (prefixMatch) return undefined;

  return false;
};

// 正しい入力の処理
const handleCorrectInput = (): number => {
  state.offset = 1;
  showGuide();
  state.viewIndex++;
  state.inputChar += state.userInput;
  state.currentQuestionIndex += 1;
  state.userInput = "";

  const yomi = state.currentQuestion?.yomi || "";
  if (state.currentQuestionIndex >= yomi.length) return 0;

  return 1;
};

// 間違った入力の処理
const handleIncorrectInput = (neededChars: string[]): boolean => {
  const isMatch = neededChars.some((value) =>
    value.startsWith(state.userInput)
  );
  if (!isMatch) {
    playFailed();
    gameStore.setSubResult(gameStore.subResult + 1);
    state.userInput = "";
    return false;
  }
  return true;
};

const success = () => {
  playGetCard();
  gameStore.setResult(gameStore.result + 1);
  state.viewIndex = 0;
  state.viewIndexKana = 0;
  state.listIndex++;
  state.inputChar = "";
  state.currentQuestionIndex = 0;
  setQuestion();
};

const updateScopeArray = () => {
  const yomi = state.currentQuestion.yomi || "";
  state.scopeArray = [];
  let margin = 1;

  Array.from(yomi).forEach((char, i) => {
    let hira = char as string;

    // マージが2の時はスキップ
    if (margin === 2) {
      margin = 1;
      return;
    }

    // 'っ'の処理
    if (char === "っ") {
      hira = handleSmallHiraForSmallChar(yomi, i, margin);
      margin += 2;
    }
    // 小さなひらがなの処理
    else if (checkSmallHira(yomi, i, margin)) {
      hira = handleSmallHiraForSmallChar(yomi, i, margin);
      margin++;
    }
    // 'ん' の処理
    else if (char === "ん" && !checkAfterN(yomi, i)) {
      hira = "ン";
    }

    // ローマ字に変換できる場合は scopeArray に追加
    const romajiArray = CHAR_TABLE[hira];
    if (romajiArray && romajiArray.length > 0) {
      state.scopeArray.push(romajiArray[0]);
    }
  });
};

// 小さなひらがな（'っ' や 小文字）を処理する
const handleSmallHiraForSmallChar = (
  yomi: string,
  index: number,
  margin: number
): string => {
  let hira = yomi[index];
  const nextChar = yomi[index + margin];
  if (nextChar) {
    hira += nextChar;
    margin++;
    if (checkSmallHira(yomi, index, margin)) {
      hira += yomi[index + margin];
      margin++;
    }
  }
  return hira;
};

const showGuide = () => {
  if (!state.scopeArray || state.scopeArray.length === 0) return;
  state.currentQuestionRome = state.scopeArray
    .slice(state.viewIndex + state.offset)
    .join("");
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
