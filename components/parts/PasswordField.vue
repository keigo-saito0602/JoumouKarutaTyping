<template>
  <v-text-field
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :label="label"
    :type="show ? 'text' : 'password'"
    :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
    @click:append-inner="toggle"
    autocomplete="new-password"
    prepend-inner-icon="mdi-lock"
    variant="outlined"
    density="comfortable"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  modelValue: string;
  label: string;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const show = ref(false);
const toggle = () => (show.value = !show.value);
</script>
