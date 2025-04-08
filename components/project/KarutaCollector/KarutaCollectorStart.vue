<script setup lang="ts">
import { ref } from "vue";
import { useGameStore } from "@/stores/game";
import KarutaButton from "@/components/parts/KarutaButton.vue";
import KarutaTextField from "@/components/parts/KarutaTextField.vue";

const gameStore = useGameStore();

// 入力フィールドに使う名前（初期値はstoreから）
const name = ref<string>(gameStore.userName || "");

// ゲーム開始処理
const startGame = () => {
  if (name.value) {
    gameStore.setLogin(true, name.value);
    gameStore.setGameStatus("PLAYING");
  } else {
    alert("ニックネームを入力してください");
  }
};
</script>

<template>
  <v-container class="app-start" style="margin-top: 20%">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <KarutaTextField
          v-model="name"
          :input-label="'ニックネームを入力して、スタート！'"
          :validation-message="'ニックネームを入力してください'"
          @enter="startGame"
        />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <KarutaButton
          :disabled="!name"
          class="app-button"
          color="primary"
          @click="startGame"
        >
          スタート！
        </KarutaButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.app-start {
  text-align: center;
}
</style>
