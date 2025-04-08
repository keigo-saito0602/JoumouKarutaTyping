<template>
  <div class="text-container">
    <div class="text">
      <h1>{{ text }}</h1>
      <template v-if="yomi">
        <h2>
          <span style="color: red">{{ yomi.substring(0, viewIndexKana) }}</span>
          <span>{{ yomi.substring(viewIndexKana) }}</span>
        </h2>
      </template>
      <h2>
        <span style="color: red">{{ inputChar }}{{ userInput }}</span>
        {{ currentQuestionRome.substring(userInput.length) }}
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
  yomi: string;
  viewIndexKana: number;
  inputChar: string;
  userInput: string;
  currentQuestionRome: string;
}>();
</script>
