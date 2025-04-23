<template>
  <div class="base-text-field">
    <v-text-field
      :model-value="modelValue"
      :label="label"
      :type="type"
      :counter="counter"
      :rules="rules"
      :prepend-icon="icon"
      :autocomplete="autocomplete"
      :variant="variant"
      :density="density"
      :bg-color="bgColor"
      :disabled="disabled"
      :placeholder="placeholder"
      v-bind="$attrs"
      @update:model-value="(v) => $emit('update:modelValue', v)"
      @keyup.enter="$emit('enter')"
    />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "BaseTextField", inheritAttrs: false });

defineProps<{
  modelValue: string;
  label?: string;
  type?: string;
  counter?: string;
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
.base-text-field :deep(.v-field__input) {
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 2rem;
  padding: 30px 16px 10px 16px;
}
</style>
