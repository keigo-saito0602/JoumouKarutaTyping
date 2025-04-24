<template>
  <div class="timer">
    <p>{{ timeText }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{
  duration: number;
}>();

const emit = defineEmits<{
  (event: "onTimeUp"): void;
}>();

const timeText = ref("00:00:00");
const timerId = ref<NodeJS.Timeout | number | null>(null);
const endTime = ref(0);

const updateTime = () => {
  const now = Date.now();
  const remaining = endTime.value - now;

  if (remaining <= 0) {
    timeText.value = "00:00:00";
    clearInterval(timerId.value as number);
    emit("onTimeUp");
    return;
  }

  const minutes = `00${Math.floor(remaining / 60000)}`.slice(-2);
  const seconds = `00${Math.floor((remaining % 60000) / 1000)}`.slice(-2);
  const milliseconds = `00${Math.floor((remaining % 1000) / 10)}`.slice(-2);

  timeText.value = `${minutes}:${seconds}:${milliseconds}`;
};

onMounted(() => {
  endTime.value = Date.now() + props.duration;
  timerId.value = setInterval(updateTime, 10);
});

onBeforeUnmount(() => {
  if (timerId.value) {
    clearInterval(timerId.value as number);
  }
});
</script>

<style scoped lang="scss">
.timer {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}
</style>
