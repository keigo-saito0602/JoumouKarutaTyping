<template>
  <v-dialog v-model="localVisible" max-width="400">
    <v-card>
      <v-card-title class="text-h6">{{ title }}</v-card-title>
      <v-card-text>{{ text }}</v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="cancel">{{ cancelLabel }}</v-btn>
        <v-btn :color="confirmColor" @click="confirm">{{ confirmLabel }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "BaseConfirmDialog" });

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  text?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
}>();

const localVisible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit("update:modelValue", val),
});

const confirm = () => {
  emit("confirm");
  localVisible.value = false;
};

const cancel = () => {
  localVisible.value = false;
};
</script>
