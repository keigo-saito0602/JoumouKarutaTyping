export const createValidationRules = (
  t: (key: string, params?: any) => string
) => ({
  required: (v: string) => !!v || t("form.required"),
  email: (v: string) => /.+@.+\..+/.test(v) || t("form.invalid_email"),
  minLength: (length: number) => (v: string) =>
    (v?.length ?? 0) >= length || t("form.min_length", { length }),
  maxLength: (length: number) => (v: string) =>
    (v?.length ?? 0) <= length || t("form.max_length", { length }),
  numeric: (v: string) => /^\d+$/.test(v) || t("form.numeric"),
  alpha: (v: string) => /^[a-zA-Z]+$/.test(v) || t("form.alpha"),
  alphaNum: (v: string) => /^[a-zA-Z0-9]+$/.test(v) || t("form.alpha_num"),
  sameAs: (target: string, label: string) => (v: string) =>
    v === target || t("form.same_as", { label }),
});
