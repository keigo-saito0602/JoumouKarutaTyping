import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    volume: 1.0,
  }),
  actions: {
    setVolume(value: number) {
      this.volume = Math.min(1.0, Math.max(0.0, value));
    },
  },
});
