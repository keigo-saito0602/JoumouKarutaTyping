<template>
  <div style="display: none">
    <audio
      v-for="(src, key) in sounds"
      :key="key"
      :ref="(el) => setAudioRef(key, el)"
      :src="src"
      preload="auto"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SOUNDS } from "@/constants/sound";
import type { SoundKey } from "@/constants/sound";
import { useSettingsStore } from "@/stores/settings";

const settings = useSettingsStore();

/**
 * 再生対象のサウンドファイル一覧
 */
const sounds: Record<SoundKey, string> = SOUNDS;

/**
 * audio 要素の参照を保持
 */
const audioMap = ref(new Map<SoundKey, HTMLAudioElement>());

/**
 * 各audioタグのref登録用
 */
const setAudioRef = (
  key: string,
  el: Element | ComponentPublicInstance | null
) => {
  if (!(key in sounds)) return;

  const audio = el instanceof HTMLAudioElement ? el : null;
  if (audio) {
    audioMap.value.set(key as SoundKey, audio);
  }
};

/**
 * 指定された音を再生
 */
const play = (key: SoundKey) => {
  const audio = audioMap.value.get(key);
  if (audio) {
    audio.volume = settings.volume ?? 1.0;
    audio.currentTime = 0;
    audio.play();
  }
};

defineExpose({ play });
</script>
