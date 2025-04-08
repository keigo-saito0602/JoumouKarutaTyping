<template>
  <v-text-field
    class="base-text-field"
    :model-value="modelValue"
    @update:model-value="(v) => $emit('update:modelValue', v)"
    @keyup.enter="$emit('enter')"
    :label="label"
    :type="type"
    :rules="rules"
    :prepend-icon="icon"
    :autocomplete="autocomplete"
    :variant="variant"
    :density="density"
    :bg-color="bgColor"
    :disabled="disabled"
    :placeholder="placeholder"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
defineOptions({ name: "BaseTextField", inheritAttrs: false });

defineProps<{
  modelValue: string;
  label?: string;
  type?: string;
  rules?: ((v: string) => true | string)[];
  icon?: string;
  autocomplete?: string;
  variant?: "filled" | "outlined" | "solo" | "plain" | "underlined";
  density?: "comfortable" | "compact" | "default";
  bgColor?: string;
  disabled?: boolean;
  placeholder?: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "enter"): void;
}>();
</script>

<style scoped lang="scss">
.base-text-field :deep(.v-input) {
  height: 80px;
}
.base-text-field :deep(.v-input__control) {
  font-size: 1.5rem;
}
.base-text-field :deep(.v-input__field) {
  padding: 16px;
}
</style>
