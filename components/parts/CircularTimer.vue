<template>
  <div class="circular-timer">
    <v-progress-circular
      :model-value="progress"
      :color="progressColor"
      :size="150"
      :width="13"
      rotate="360"
      class="timer-progress"
    >
      <div class="timer-texts">
        <div class="main-time">{{ mainTime }}</div>
        <div class="milli-time">{{ milliTime }}</div>
      </div>
    </v-progress-circular>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{
  duration: number;
}>();

const emit = defineEmits<{
  (event: "onTimeUp"): void;
}>();

const remaining = ref(props.duration);
const endTime = ref(0);
const timerId = ref<NodeJS.Timeout | null>(null);

const mainTime = ref("00:00");
const milliTime = ref("00");

const progress = computed(() => {
  const percent = (remaining.value / props.duration) * 100;
  return Math.max(0, percent);
});

const progressColor = computed(() => {
  if (progress.value > 50) return "green";
  if (progress.value > 20) return "orange";
  return "red";
});

const updateTimeText = () => {
  const totalMs = Math.max(0, remaining.value);
  const totalSec = Math.floor(totalMs / 1000);
  const minutes = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const seconds = String(totalSec % 60).padStart(2, "0");
  const milliseconds = String(Math.floor((totalMs % 1000) / 10)).padStart(
    2,
    "0"
  );

  mainTime.value = `${minutes}:${seconds}`;
  milliTime.value = milliseconds;
};

const tick = () => {
  const now = Date.now();
  const diff = endTime.value - now;
  remaining.value = diff;
  updateTimeText();

  if (diff <= 0) {
    clearInterval(timerId.value!);
    emit("onTimeUp");
  }
};

onMounted(() => {
  endTime.value = Date.now() + props.duration;
  tick();
  timerId.value = setInterval(tick, 50);
});

onBeforeUnmount(() => {
  if (timerId.value) clearInterval(timerId.value);
});
</script>

<style scoped lang="scss">
.circular-timer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.timer-progress {
  transition: stroke 0.2s ease;
}

.timer-texts {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-time {
  font-size: 1.2rem;
  font-weight: bold;
}

.milli-time {
  font-size: 0.75rem;
  color: gray;
  margin-top: -0.1rem;
}
</style>
