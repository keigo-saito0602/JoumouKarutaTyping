<template>
  <v-form ref="formRef" @submit.prevent>
    <BaseTextField
      v-model="modelValueEmail"
      :label="$t('form.email')"
      type="email"
      :rules="[rules.required, rules.email]"
      icon="mdi-email"
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
    <BaseSubmitButton
      :label="$t('common.login')"
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
import BaseSubmitButton from "~/components/parts/BaseButton.vue";
import PasswordField from "~/components/parts/PasswordField.vue";
import { createValidationRules } from "~/utils/validationRules";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  modelValueEmail?: string;
  modelValuePassword?: string;
  loading?: boolean;
  error?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValueEmail", value: string): void;
  (e: "update:modelValuePassword", value: string): void;
  (e: "submit"): void;
}>();

const modelValueEmail = defineModel<string>("email");
const modelValuePassword = defineModel<string>("password");

const { t } = useI18n();
const rules = createValidationRules(t);
const formRef = ref();

const onSubmit = () => emit("submit");

defineExpose({ formRef });
</script>
