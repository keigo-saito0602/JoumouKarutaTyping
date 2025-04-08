<template>
  <div class="controller-buttons">
    <KarutaButton class="app-button" @click="$emit('retry')">
      <i class="fa-solid fa-repeat" />リトライ
    </KarutaButton>
    <KarutaButton class="app-button" @click="$emit('result')">
      <i class="fa-solid fa-square-poll-vertical" />結果を見る
    </KarutaButton>
  </div>
</template>

<script setup lang="ts">
defineEmits(["retry", "result"]);
</script>
