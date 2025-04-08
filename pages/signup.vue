<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh">
    <v-card width="400">
      <v-card-title class="text-h6">{{ $t("common.signup") }}</v-card-title>
      <v-card-text>
        <SignupForm />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import SignupForm from "@/components/project/SignupForm.vue";
</script>
