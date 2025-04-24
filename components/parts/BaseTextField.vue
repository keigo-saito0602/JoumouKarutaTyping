<template>
  <v-text-field
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :label="label"
    :type="type"
    :variant="variant"
    :density="density"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="className"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
defineOptions({ name: "KarutaTextField", inheritAttrs: false });

defineProps<{
  modelValue: string;
  label?: string;
  type?: string;
  variant?: "outlined" | "filled" | "solo" | "plain" | "underlined";
  density?: "default" | "comfortable" | "compact";
  placeholder?: string;
  disabled?: boolean;
  className?: string; // class の代わりに
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>
