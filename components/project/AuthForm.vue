<template>
  <v-form ref="formRef">
    <BaseTextField
      v-if="isSignup"
      v-model="modelValueName"
      :label="$t('form.username')"
      icon="mdi-account"
      :rules="[rules.required, rules.minLength(1)]"
      class="mb-4"
      autocomplete="name"
    />
    <BaseTextField
      v-model="modelValueEmail"
      :label="$t('form.email')"
      icon="mdi-email"
      :rules="[rules.required, rules.email]"
      class="mb-4"
      autocomplete="email"
    />
    <PasswordField
      v-model="modelValuePassword"
      :label="$t('form.password')"
      :rules="[rules.required, rules.minLength(6)]"
      class="mb-4"
      autocomplete="new-password"
    />
    <BaseButton
      :label="buttonLabel"
      :loading="loading"
      :block="true"
      color="primary"
      @click="emit('submit')"
    />
    <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed, defineExpose } from "vue";
import BaseTextField from "@/components/parts/BaseTextField.vue";
import PasswordField from "@/components/parts/PasswordField.vue";
import BaseButton from "@/components/parts/BaseButton.vue";
import { createValidationRules } from "~/utils/validationRules";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  mode: "login" | "signup";
  loading?: boolean;
  error?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValueName", val: string): void;
  (e: "update:modelValueEmail", val: string): void;
  (e: "update:modelValuePassword", val: string): void;
  (e: "submit"): void;
}>();

const modelValueName = defineModel<string>("name");
const modelValueEmail = defineModel<string>("email");
const modelValuePassword = defineModel<string>("password");

const { t } = useI18n();
const rules = createValidationRules(t);
const formRef = ref();

const isSignup = computed(() => props.mode === "signup");
const buttonLabel = computed(() =>
  isSignup.value ? t("common.signup") : t("common.login")
);

defineExpose({ formRef });
</script>
