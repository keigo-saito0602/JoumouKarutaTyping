<template>
  <v-text-field
    :model-value="modelValue"
    @update:model-value="(value) => $emit('update:modelValue', value)"
    :label="label"
    :type="type"
    :rules="rules"
    :prepend-icon="icon"
    :autocomplete="autocomplete"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, default: "text" },
    rules: {
      type: Array as () => ((v: string) => true | string)[],
      default: () => [],
    },
    icon: { type: String, default: "" },
    autocomplete: { type: String, default: "" },
  },
  emits: ["update:modelValue"],
});
</script>
