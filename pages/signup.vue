<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh">
    <v-card width="400">
      <v-card-title class="text-h6">{{ $t("common.signup") }}</v-card-title>
      <v-card-text>
        <AuthForm
          mode="signup"
          v-model:name="form.name"
          v-model:email="form.email"
          v-model:password="form.password"
          :loading="loading"
          :error="error"
          @submit="handleSignup"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";
import { useFlashStore } from "~/stores/flash";
import AuthForm from "@/components/project/AuthForm.vue";

const form = reactive({
  name: "",
  email: "",
  password: "",
});

const error = ref("");
const loading = ref(false);
const formRef = ref();

const auth = useAuthStore();
const flash = useFlashStore();
const router = useRouter();

const handleSignup = async () => {
  const isValid = await formRef.value?.formRef?.validate();
  if (!isValid) return;

  loading.value = true;
  error.value = "";

  try {
    await auth.signupAndLogin(form.name, form.email, form.password);
    flash.show("アカウント登録に成功しました", "success");
    await router.push("/game");
  } catch (e: any) {
    error.value = e.message || "登録に失敗しました";
  } finally {
    loading.value = false;
  }
};
</script>
