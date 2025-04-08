<template>
  <div class="container">
    <template v-if="state.isClear">
      <GameController @retry="toStart" @result="toResult" />
    </template>
    <template v-else>
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
</template>

<script setup lang="ts">
import KartaDisplay from "@/components/parts/game/KartaDisplay.vue";
import TypingDisplay from "@/components/parts/game/TypingDisplay.vue";
import GameController from "@/components/parts/game/GameController.vue";
import KartaComment from "@/components/parts/game/KartaComment.vue";
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { CHAR_TABLE } from "@/types/TypingData";
import { soundPlayer } from "@/utils/soundPlayer";
import { getCards } from "@/services/api";
import { checkSmallHira, checkAfterN } from "@/utils/kanaUtils";
import { shuffleList } from "@/utils/gameUtils";
import { useGameStore } from "@/stores/game";

const gameStore = useGameStore();

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

const toResult = () => {
  gameStore.setGameStatus("RESULT");
};

const toStart = () => {
  if (state.timerId) clearTimeout(state.timerId);
  gameStore.resetGame();
};

const runTimer = () => {
  const _start = new Date();
  state.startTime = _start.getTime();
  state.limitTime = _start.setMinutes(_start.getMinutes() + 2);
  timerHandler();

  setTimeout(() => {
    state.isClear = true;
    clearTimeout(state.timerId);
    gameStore.setPlayTimeText("");
  }, 120000);
};

const timerHandler = () => {
  const _now = new Date().getTime();
  const _diff = new Date(state.limitTime - _now);
  const ms = `${Math.floor((_diff.getMilliseconds() / 1000) * 100)}`;
  const sec = `${_diff.getSeconds()}`;
  const min = `${_diff.getMinutes()}`;

  if (min === "0" && sec === "0") {
    soundPlayer.play("WHISTLE");
  }

  gameStore.setPlayTimeText(
    `${("00" + min).slice(-2)}'${("00" + sec).slice(-2)}"${("00" + ms).slice(
      -2
    )}`
  );

  state.timerId = setTimeout(timerHandler, 10);
};

const handleKeydown = (e: KeyboardEvent) => {
  e.preventDefault();
  soundPlayer.play("KEY_STROKE");
  const judged = judgeInputChar(e.key);
  if (judged === 0) {
    success();
  }
};

const judgeInputChar = (chr: string): boolean | number | undefined => {
  state.offset = 0;
  showGuide();

  if (state.cancelN) {
    state.cancelN = false;
    if (chr === "n") {
      state.inputChar += chr.toUpperCase();
      return;
    }
  }

  state.userInput += chr.toUpperCase();
  let margin = 1;

  if (state.isClear) return;

  const yomi = state.currentQuestion?.yomi || "";
  if (!yomi || state.currentQuestionIndex >= yomi.length) return false;

  let hiragana = yomi[state.currentQuestionIndex];

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
  } else if (
    hiragana === "ん" &&
    !checkAfterN(yomi, state.currentQuestionIndex)
  ) {
    hiragana = "ン";
    state.cancelN = true;
  }

  const neededChars = CHAR_TABLE[hiragana];
  if (!neededChars) return false;

  const isCorrect = neededChars.some((value) => value === state.userInput);
  if (isCorrect) {
    state.offset = 1;
    showGuide();
    state.viewIndex++;
    state.inputChar += state.userInput;
    state.currentQuestionIndex += margin;
    state.userInput = "";

    if (state.currentQuestionIndex >= yomi.length) return 0;
  } else {
    const isMatch = neededChars.some((value) =>
      value.startsWith(state.userInput)
    );
    if (!isMatch) {
      soundPlayer.play("FAILED");
      gameStore.setSubResult(gameStore.subResult + 1);
      state.userInput = "";
      return false;
    }
  }

  return;
};

const success = () => {
  soundPlayer.play("GET_CARD");
  gameStore.setResult(gameStore.result + 1);
  state.viewIndex = 0;
  state.viewIndexKana = 0;
  state.listIndex++;
  state.inputChar = "";
  state.currentQuestionIndex = 0;
  setQuestion();
};

const setFirstQuestion = async () => {
  const r = await getCards();
  state.cardList = r;
  state.randomCardList = shuffleList(state.cardList);
  soundPlayer.play("GET_CARD");
  setQuestion();
};

const setQuestion = () => {
  state.currentQuestion = state.randomCardList[state.listIndex];
  state.currentPicturePath = `/cards/${state.currentQuestion.picture_card}`;
  updateScopeArray();
  showGuide();
};

const updateScopeArray = () => {
  const yomi = state.currentQuestion.yomi || "";
  state.scopeArray = [];
  let margin = 1;

  Array.from(yomi).forEach((char, i) => {
    let hira = char as string;
    if (margin === 2) {
      margin = 1;
      return;
    }

    if (char === "っ") {
      const next = yomi[i + margin];
      if (next) {
        hira += next;
        margin++;
        if (checkSmallHira(yomi, i, margin)) {
          hira += yomi[i + margin];
          margin++;
        }
      }
    } else if (checkSmallHira(yomi, i, margin)) {
      hira += yomi[i + margin];
      margin++;
    } else if (char === "ん" && !checkAfterN(yomi, i)) {
      hira = "ン";
    }

    const romajiArray = CHAR_TABLE[hira];
    if (!romajiArray || romajiArray.length === 0) return;
    state.scopeArray.push(romajiArray[0]);
  });
};

const showGuide = () => {
  if (!state.scopeArray || state.scopeArray.length === 0) return;
  state.currentQuestionRome = state.scopeArray
    .slice(state.viewIndex + state.offset)
    .join("");
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  runTimer();
  setFirstQuestion();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  if (state.timerId) clearTimeout(state.timerId);
});
</script>
