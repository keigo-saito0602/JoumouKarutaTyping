<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh">
    <v-card width="400">
      <v-card-title class="text-h6">ログイン</v-card-title>
      <v-card-text>
        <LoginForm
          ref="formRef"
          v-model:email="email"
          v-model:password="password"
          :loading="loading"
          :error="error"
          @update:email="email = $event"
          @update:password="password = $event"
          @submit="handleLogin"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { login } from "~/utils/authApi";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";
import { useFlashStore } from "~/stores/flash";
import LoginForm from "@/components/project/LoginForm.vue";

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const formRef = ref();

const auth = useAuthStore();
const flash = useFlashStore();
const router = useRouter();

const handleLogin = async () => {
  const isValid = await formRef.value?.formRef?.validate();
  if (!isValid) return;

  loading.value = true;
  error.value = "";

  try {
    const res = await login({ email: email.value, password: password.value });

    auth.setUser(res.user, res.token);
    flash.show("ログインに成功しました", "success");

    await router.push("/game");
  } catch (e: any) {
    error.value = e.message || "ログインに失敗しました";
    console.error("Login failed", e);
  } finally {
    loading.value = false;
  }
};
</script>
