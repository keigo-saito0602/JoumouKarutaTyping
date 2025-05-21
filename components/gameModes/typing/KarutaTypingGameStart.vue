<template>
  <v-container class="app-start" style="margin-top: 20%">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <template v-if="!gameStore.isLogin">
          <KarutaTextField
            v-model="name"
            counter="20"
            :label="'ニックネームを入力して、スタート！'"
            :rules="[rules.required, rules.maxLength(20)]"
          />
        </template>

        <template v-else>
          <div v-if="!isEditing" class="text-center mb-2">
            <p class="text-h6">{{ gameStore.userName }} さん</p>
            <KarutaButton
              label="名前を変更する"
              class="app-button mt-4"
              color="primary"
              @click="startEditing"
            />
          </div>

          <div v-else>
            <KarutaTextField
              v-model="name"
              counter="20"
              label="新しいニックネーム"
              :rules="[rules.required, rules.maxLength(20)]"
            />
            <KarutaButton
              label="変更を保存"
              class="app-button mt-4"
              color="primary"
              @click="saveUserName"
            />
          </div>
        </template>

        <KarutaButton
          :disabled="!canStart"
          label="スタート！"
          class="app-button mt-4"
          color="primary"
          @click="startGame"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useGameStore } from "@/stores/game";
import { useAuthStore } from "@/stores/auth";
import { createValidationRules } from "@/utils/validationRules";
import KarutaButton from "@/components/parts/KarutaButton.vue";
import KarutaTextField from "@/components/parts/KarutaTextField.vue";

const gameStore = useGameStore();
const authStore = useAuthStore();
const { t } = useI18n();
const rules = createValidationRules(t);

const isEditing = ref(false);
const name = ref<string>(gameStore.userName || "");

onMounted(() => {
  if (authStore.user?.name) {
    gameStore.setLogin(true, authStore.user.name);
  }
});

const canStart = computed(() =>
  gameStore.isLogin ? true : name.value.length > 0
);

const saveUserName = () => {
  if (!name.value) return;
  gameStore.setLogin(true, name.value);
  isEditing.value = false;
};

const startEditing = () => {
  isEditing.value = true;
  name.value = gameStore.userName;
};

const startGame = () => {
  if (!gameStore.isLogin && !name.value) {
    alert("ニックネームを入力してください");
    return;
  }

  gameStore.setLogin(true, name.value);
  gameStore.setGameStatus("PLAYING");
};
</script>

<style scoped>
.app-start {
  text-align: center;
}
</style>
