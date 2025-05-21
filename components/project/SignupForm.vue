<template>
  <v-form ref="formRef">
    <BaseTextField
      v-model="modelValueName"
      :label="$t('form.username')"
      icon="mdi-account"
      :rules="[rules.required, rules.minLength(1)]"
      autocomplete="name"
      class="mb-4"
    />
    <BaseTextField
      v-model="modelValueEmail"
      :label="$t('form.email')"
      icon="mdi-email"
      :rules="[rules.required, rules.email]"
      autocomplete="email"
      class="mb-4"
    />
    <PasswordField
      v-model="modelValuePassword"
      :label="$t('form.password')"
      :rules="[rules.required, rules.minLength(6)]"
      autocomplete="new-password"
      class="mb-4"
    />
    <BaseButton
      :label="$t('common.signup')"
      :color="'primary'"
      :loading="loading"
      :block="true"
      @click="onSubmit"
    />
    <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
  </v-form>
</template>

<script setup lang="ts">
import { ref, defineExpose } from "vue";
import BaseTextField from "@/components/parts/BaseTextField.vue";
import PasswordField from "@/components/parts/PasswordField.vue";
import BaseButton from "@/components/parts/BaseButton.vue";
import { createValidationRules } from "~/utils/validationRules";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  modelValueName?: string;
  modelValueEmail?: string;
  modelValuePassword?: string;
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

const onSubmit = () => emit("submit");

defineExpose({ formRef });
</script>
