<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh">
    <v-card width="400">
      <v-card-title class="text-h6">ログイン</v-card-title>
      <v-card-text>
        <LoginForm />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import LoginForm from "@/components/project/LoginForm.vue";
</script>
