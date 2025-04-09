<template>
  <div class="controller-buttons">
    <BaseButton class="app-button" @click="$emit('retry')">
      <i class="fa-solid fa-repeat" />リトライ
    </BaseButton>
    <BaseButton class="app-button" @click="$emit('result')">
      <i class="fa-solid fa-square-poll-vertical" />結果を見る
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/components/parts/BaseButton.vue";
defineEmits(["retry", "result"]);
</script>
