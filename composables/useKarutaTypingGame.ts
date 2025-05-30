import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { fetchShuffledCards, createEmptyCard } from "@/services/cardService";
import { CHAR_TABLE } from "@/constants/TypingData";
import { checkSmallHira, checkAfterN } from "@/utils/kanaUtils";
import { useGameStore } from "@/stores/game";
import type { Card } from "@/services/cardService";

export const useKarutaTypingGame = () => {
  const gameStore = useGameStore();

  const state = reactive({
    cardList: [] as Card[],
    randomCardList: [] as Card[],
    listIndex: 0,
    currentQuestion: createEmptyCard(),
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
    timerId: null as ReturnType<typeof setTimeout> | null,
  });

  // 効果音の再生関数を外部から差し込む仕組み
  const playSound: {
    keyStroke: () => void;
    getCard: () => void;
    failed: () => void;
    end: () => void;
  } = {
    keyStroke: () => {},
    getCard: () => {},
    failed: () => {},
    end: () => {},
  };

  // 外部から再生用関数をセットする
  const setSoundFns = (fns: typeof playSound) => {
    Object.assign(playSound, fns);
  };

  // キー入力イベントを処理
  const handleKeydown = (e: KeyboardEvent) => {
    e.preventDefault();
    playSound.keyStroke();

    const judged = judgeInputChar(e.key);
    if (judged === 0) success(); // 全問正解時に次のカードへ
  };

  // ゲーム初期化・カードの取得
  const setupGame = async () => {
    const cards = await fetchShuffledCards();
    state.cardList = cards;
    state.randomCardList = cards;
    playSound.getCard();
    setQuestion();
  };

  // 現在の問題カードをセット
  const setQuestion = () => {
    state.currentQuestion = state.randomCardList[state.listIndex];
    state.currentPicturePath = `/cards/${state.currentQuestion.picture_card}`;
    updateScopeArray();
    showGuide();
  };

  // 入力文字を判定
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

          if (state.currentQuestionIndex >= yomi.length) return 0;

          showGuide();
          return true;
        }
        return true;
      }
    }

    playSound.failed();
    gameStore.setSubResult(gameStore.subResult + 1);
    state.userInput = "";
    return false;
  };

  // 「ん」入力の特殊処理（次が母音以外のときのみ1文字で確定）
  const handleSpecialN = (chr: string): boolean => {
    if (state.cancelN) {
      state.cancelN = false;
      if (chr === "n") {
        state.inputChar += chr.toUpperCase();
        return true;
      }
    }
    return false;
  };

  // 小書き文字の処理（っゃゅょ等）
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
        }
      }
    }
    return hiragana;
  };

  // 「ん」の変換処理（次が母音の時は「ン」に変換）
  const handleN = (yomi: string, hiragana: string): string => {
    if (hiragana === "ん" && !checkAfterN(yomi, state.currentQuestionIndex)) {
      hiragana = "ン";
      state.cancelN = true;
    }
    return hiragana;
  };

  // 正解入力時の処理
  const success = () => {
    playSound.getCard();
    gameStore.setResult(gameStore.result + 1);
    state.viewIndex = 0;
    state.viewIndexKana = 0;
    state.listIndex++;
    state.inputChar = "";
    state.currentQuestionIndex = 0;
    setQuestion();
  };

  // 表示用ローマ字配列を更新
  const updateScopeArray = () => {
    const yomi = state.currentQuestion.yomi || "";
    state.scopeArray = [];
    let margin = 1;

    Array.from(yomi).forEach((char, i) => {
      let hira = char;
      if (margin === 2) {
        margin = 1;
        return;
      }

      if (char === "っ") {
        hira = handleSmallHiraForSmallChar(yomi, i, margin);
        margin += 2;
      } else if (checkSmallHira(yomi, i, margin)) {
        hira = handleSmallHiraForSmallChar(yomi, i, margin);
        margin++;
      } else if (char === "ん" && !checkAfterN(yomi, i)) {
        hira = "ン";
      }

      const romajiArray = CHAR_TABLE[hira];
      if (romajiArray && romajiArray.length > 0) {
        state.scopeArray.push(romajiArray[0]);
      }
    });
  };

  // 小書き文字の処理を共通関数化
  const handleSmallHiraForSmallChar = (
    yomi: string,
    index: number,
    margin: number
  ): string => {
    let hira = yomi[index];
    const nextChar = yomi[index + margin];
    if (nextChar) {
      hira += nextChar;
      if (checkSmallHira(yomi, index, margin + 1)) {
        hira += yomi[index + margin + 1];
      }
    }
    return hira;
  };

  // ローマ字ガイド表示を更新
  const showGuide = () => {
    if (!state.scopeArray || state.scopeArray.length === 0) return;
    state.currentQuestionRome = state.scopeArray
      .slice(state.viewIndex + state.offset)
      .join("");
  };

  // 初期化時・終了時にイベントリスナーを登録・解除
  onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
    setupGame();
  });

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeydown);
    if (state.timerId) clearTimeout(state.timerId);
  });

  return {
    state,
    handleKeydown,
    setupGame,
    setSoundFns,
  };
};
