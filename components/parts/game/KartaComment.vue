<template>
  <div class="comment-text">
    {{ comment }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  comment: {
    type: String;
    default: "";
  };
}>();
</script>

<style scoped lang="scss">
.comment-text {
  font-size: 0.7rem;
  font-weight: bold;
  text-align: center;
  line-height: 1.4;
  color: #333;
}
</style>
