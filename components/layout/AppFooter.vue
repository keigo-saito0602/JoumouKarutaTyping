<template>
  <v-footer app color="secondary" dark class="footer-fixed">
    <v-container class="text-center">
      <span>&copy; {{ $t("footer.copyright") }} {{ $t("app.name") }}</span>
    </v-container>
  </v-footer>
</template>

<style scoped lang="scss">
.footer-fixed {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
