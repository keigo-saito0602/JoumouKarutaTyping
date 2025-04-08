import vue from "eslint-plugin-vue";
import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";

export default [
  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      vue,
      "@typescript-eslint": tseslint,
      prettier,
    },
    rules: {
      ...vue.configs["vue3-recommended"].rules,
      ...tseslint.configs.recommended.rules,
      "prettier/prettier": "error",
      "vue/multi-word-component-names": "off",
    },
  },
];
