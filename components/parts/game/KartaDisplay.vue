<template>
  <div class="card-container">
    <div class="card-inner">
      <div class="card-face card-front">
        <img :src="picturePath" alt="札画像" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  picturePath: string;
}>();
</script>

<style scoped lang="scss">
.card-container {
  width: 250px;
  height: 350px;
  perspective: 1000px;
  margin: auto;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: none;
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  overflow: hidden;
  border-radius: 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-front {
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
