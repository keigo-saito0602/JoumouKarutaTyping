import { defineStore } from "pinia";
import { GAME_STATUS } from "@/types/game";
import type { GameStatus, GameScore, GameUser } from "@/types/game";

interface GameState extends GameScore, GameUser {
  gameStatus: GameStatus;
}

export const useGameStore = defineStore("game", {
  state: (): GameState => ({
    gameStatus: GAME_STATUS.START,
    userName: "",
    isLogin: false,
    result: 0,
    subResult: 0,
    playTimeText: "",
  }),

  actions: {
    setGameStatus(status: GameStatus) {
      this.gameStatus = status;
    },

    setLogin(isLogin: boolean, name: string = "") {
      this.isLogin = isLogin;
      this.userName = name;
    },

    setResult(count: number) {
      this.result = count;
    },

    setSubResult(count: number) {
      this.subResult = count;
    },

    setPlayTimeText(text: string) {
      this.playTimeText = text;
    },

    resetGame() {
      this.userName = "";
      this.result = 0;
      this.subResult = 0;
      this.playTimeText = "";
      this.gameStatus = GAME_STATUS.START;
    },
  },
});
