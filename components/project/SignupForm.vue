<template>
  <v-form ref="formRef" @submit.prevent="handleSignup">
    <BaseTextField
      v-model="name"
      :label="$t('form.username')"
      icon="mdi-account"
      :rules="[rules.required, rules.minLength(1)]"
      autocomplete="name"
    />
    <BaseTextField
      v-model="email"
      :label="$t('form.email')"
      icon="mdi-email"
      :rules="[rules.required, rules.email]"
      autocomplete="email"
    />
    <BaseTextField
      v-model="password"
      :label="$t('form.password')"
      icon="mdi-lock"
      :rules="[rules.required, rules.minLength(6)]"
      autocomplete="new-password"
    />
    <BaseButton
      :label="$t('common.signup')"
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
import BaseTextField from "@/components/parts/BaseTextField.vue";
import BaseButton from "@/components/parts/BaseButton.vue";
import { useI18n } from "vue-i18n";
import { createValidationRules } from "~/utils/validationRules";
import { useAuthStore } from "~/stores/auth";

const { t } = useI18n();
const rules = createValidationRules(t);

const name = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const formRef = ref();
const auth = useAuthStore();

const handleSignup = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  loading.value = true;
  error.value = "";

  try {
    const res = {
      user: { id: "456", name: name.value, email: email.value },
      token: "mock-signup-token",
    };
    auth.setUser(res.user, res.token);
    navigateTo("/dashboard");
  } catch (e: any) {
    error.value = e.message || "登録に失敗しました";
  } finally {
    loading.value = false;
  }
};
</script>
