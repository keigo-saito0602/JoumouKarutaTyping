import { SOUNDS } from "~/constants/sound";

class SoundPlayer {
  private audio: HTMLAudioElement | null = null;

  play(soundKey: keyof typeof SOUNDS) {
    const sound = SOUNDS[soundKey];
    if (!sound) {
      console.error(`Sound key "${soundKey}" is not defined.`);
      return;
    }

    const audioPath = `/sounds/${sound}`;
    fetch(audioPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Sound file not found: ${audioPath}`);
        }
        this.audio = new Audio(audioPath);
        this.audio.play();
      })
      .catch((err) => {
        console.error("Error playing sound:", err);
      });
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }
}

export const soundPlayer = new SoundPlayer();
