import { defineStore } from "pinia";

export const useFlashStore = defineStore("flash", {
  state: () => ({
    message: "",
    type: "success" as "success" | "error" | "info",
    visible: false,
  }),
  actions: {
    show(message: string, type: "success" | "error" | "info" = "success") {
      this.message = message;
      this.type = type;
      this.visible = true;

      setTimeout(() => {
        this.clear();
      }, 3000);
    },
    clear() {
      this.message = "";
      this.visible = false;
    },
  },
});
