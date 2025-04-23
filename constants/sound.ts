export type SoundKey =
  | "CONGRATULATION1"
  | "CONGRATULATION2"
  | "FAIL"
  | "FAILED"
  | "GET_CARD"
  | "KEY_STROKE"
  | "ROLL"
  | "WHISTLE";

/** パブリックパス */
const SOUND_BASE_PATH = "/sounds/";

/** サウンドファイルのパス定義 */
export const SOUNDS: Record<SoundKey, string> = {
  CONGRATULATION1: `${SOUND_BASE_PATH}congratulation1.mp3`,
  CONGRATULATION2: `${SOUND_BASE_PATH}congratulation2.mp3`,
  FAIL: `${SOUND_BASE_PATH}fail.mp3`,
  FAILED: `${SOUND_BASE_PATH}failed.mp3`,
  GET_CARD: `${SOUND_BASE_PATH}getCard.mp3`,
  KEY_STROKE: `${SOUND_BASE_PATH}keyStroke.mp3`,
  ROLL: `${SOUND_BASE_PATH}roll.mp3`,
  WHISTLE: `${SOUND_BASE_PATH}whistle.mp3`,
};
