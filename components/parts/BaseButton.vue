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
defineProps({
  label: String,
  color: String,
  loading: Boolean,
  block: Boolean,
  type: {
    type: String as PropType<"button" | "submit" | "reset">,
    default: "button",
  },
  variant: String,
  icon: String,
});
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
