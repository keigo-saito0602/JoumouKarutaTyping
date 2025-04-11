<template>
  <v-btn
    :color="color"
    :loading="loading"
    :block="block"
    :type="type"
    :variant="variant"
    :prepend-icon="icon"
    class="base-button"
  >
    <slot>{{ label }}</slot>
  </v-btn>
</template>

<script setup lang="ts">
defineProps<{
  label?: string;
  color?: string;
  loading?: boolean;
  block?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "elevated" | "flat" | "tonal" | "outlined" | "text" | "plain";
  icon?: string;
}>();
</script>

<style scoped lang="scss">
.base-button {
  text-transform: none;
}

.base-button {
  text-transform: none;
  font-weight: bold;
  margin: 0 4px;
}
</style>
