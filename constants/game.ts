export const GAME_STATUS = {
  START: "START",
  PLAYING: "PLAYING",
  RESULT: "RESULT",
} as const;

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];

export interface GameScore {
  result: number;
  subResult: number;
  playTimeText: string;
}

export interface GameUser {
  userName: string;
  isLogin: boolean;
}
