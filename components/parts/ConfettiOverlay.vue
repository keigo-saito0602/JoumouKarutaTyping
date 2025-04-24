<template>
  <canvas ref="canvasRef" class="confetti-canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineExpose } from "vue";
import confetti from "canvas-confetti";

const canvasRef = ref<HTMLCanvasElement | null>(null);
let confettiInstance: ReturnType<typeof confetti.create> | null = null;

const resizeCanvas = () => {
  if (canvasRef.value) {
    canvasRef.value.width = window.innerWidth;
    canvasRef.value.height = window.innerHeight;
  }
};

onMounted(() => {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  if (canvasRef.value) {
    confettiInstance = confetti.create(canvasRef.value, {
      resize: true,
      useWorker: true,
    });
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeCanvas);
  confettiInstance?.reset();
});

type ConfettiLevel = "low" | "normal" | "high";

function fire(level: ConfettiLevel = "normal") {
  if (!confettiInstance) return;

  const configMap = {
    low: { particleCount: 50, spread: 60, ticks: 200 },
    normal: { particleCount: 200, spread: 100, ticks: 250 },
    high: { particleCount: 400, spread: 140, ticks: 300 },
  };

  const config = configMap[level];

  confettiInstance({
    ...config,
    origin: { y: 0.6 },
  });
}

defineExpose({ fire });
</script>

<style scoped>
.confetti-canvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}
</style>
