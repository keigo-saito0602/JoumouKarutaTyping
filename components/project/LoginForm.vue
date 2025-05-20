<template>
  <v-form ref="formRef" @submit.prevent="handleLogin">
    <BaseTextField
      v-model="email"
      :label="$t('form.email')"
      type="email"
      :rules="[rules.required, rules.email]"
      icon="mdi-email"
      autocomplete="email"
    />
    <BaseTextField
      v-model="password"
      :label="$t('form.password')"
      type="password"
      :rules="[rules.required]"
      icon="mdi-lock"
      autocomplete="current-password"
    />
    <BaseSubmitButton
      :label="$t('common.login')"
      :color="'primary'"
      :loading="loading"
      :block="true"
      :type="'submit'"
    />
    <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { login } from "~/utils/authApi";
import { useAuthStore } from "~/stores/auth";
import BaseTextField from "@/components/parts/BaseTextField.vue";
import BaseSubmitButton from "~/components/parts/BaseButton.vue";
import { useI18n } from "vue-i18n";
import { createValidationRules } from "~/utils/validationRules";

const { email, password, error, loading, formRef } = useLoginForm();
const auth = useAuthStore();
const { user } = storeToRefs(auth);

const { t } = useI18n();
const rules = createValidationRules(t);

const handleLogin = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  loading.value = true;
  error.value = "";

  try {
    const res = await login({ email: email.value, password: password.value });
    auth.setUser(res.user, res.token);
    window.location.href = "/game";
  } catch (e: any) {
    error.value = e.message || "ログインに失敗しました";
  } finally {
    loading.value = false;
  }
};
</script>
