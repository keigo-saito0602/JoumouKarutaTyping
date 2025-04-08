import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { COLORS } from "~/utils/colors";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          colors: {
            primary: COLORS.primary,
            secondary: COLORS.secondary,
            error: COLORS.error,
            success: COLORS.success,
            warning: COLORS.warning,
            info: COLORS.info,
            background: COLORS.background,
            textPrimary: COLORS.textPrimary,
            textSecondary: COLORS.textSecondary,
            border: COLORS.border,
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
