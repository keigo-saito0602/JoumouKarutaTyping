<template>
  <v-btn
    class="base-button"
    :color="color"
    :variant="variant"
    :loading="loading"
    :disabled="disabled"
    :type="type"
    :block="block"
    :size="size"
    :prepend-icon="icon"
    v-bind="$attrs"
    @click="$emit('click')"
    @mouseover="$emit('mouseover')"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
    @focus="$emit('focus')"
  >
    <slot>{{ label }}</slot>
  </v-btn>
</template>

<script setup lang="ts">
defineOptions({ name: "BaseButton", inheritAttrs: false });

defineProps<{
  label?: string;
  color?: string;
  variant?: "elevated" | "flat" | "tonal" | "outlined" | "text" | "plain";
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  block?: boolean;
  size?: "x-small" | "small" | "default" | "large" | "x-large";
  icon?: string;
}>();

defineEmits<{
  (e: "click"): void;
  (e: "mouseover"): void;
  (e: "mouseenter"): void;
  (e: "mouseleave"): void;
  (e: "focus"): void;
}>();
</script>

<style scoped lang="scss">
.base-button {
  text-transform: none;
  font-weight: bold;
  margin: 12px 24px;
}
</style>
