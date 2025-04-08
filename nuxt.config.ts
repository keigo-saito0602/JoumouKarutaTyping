// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
import { fileURLToPath } from "node:url";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["vuetify/styles", "~/assets/styles/main.scss"],
  modules: ["@nuxtjs/i18n", "@pinia/nuxt"],
  build: {
    transpile: ["vuetify"],
  },
  plugins: ["~/plugins/vuetify"],
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
  },
  i18n: {
    vueI18n: fileURLToPath(new URL("./i18n.config.ts", import.meta.url)),
    langDir: "./locales",
    locales: [
      { code: "ja", iso: "ja-JP", name: "日本語", file: "ja.json" },
      { code: "en", iso: "en-US", name: "English", file: "en.json" },
    ],
    bundle: {
      optimizeTranslationDirective: false, // v-t ディレクティブ最適化機能が今後削除予定の警告がでるので警告をOFFにする設定
    },
    defaultLocale: "ja",
    strategy: "no_prefix",
    lazy: true,
  },
});
