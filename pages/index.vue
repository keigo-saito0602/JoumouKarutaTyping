<template>
  <v-container class="text-center">
    <h1>Count: {{ counter.count }}</h1>
    <v-btn @click="counter.increment" color="primary">+1</v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useCounterStore } from "~/stores/counter";

const counter = useCounterStore();
</script>
