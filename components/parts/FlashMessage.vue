<template>
  <v-snackbar
    v-model="flash.visible"
    :color="flash.type"
    timeout="3000"
    location="top"
    elevation="2"
  >
    {{ flash.message }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { useFlashStore } from "@/stores/flash";

const flash = useFlashStore();
</script>
