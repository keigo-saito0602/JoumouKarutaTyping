import { ref } from "vue";

export function useLoginForm() {
  const email = ref("");
  const password = ref("");
  const error = ref("");
  const loading = ref(false);
  const formRef = ref();

  return {
    email,
    password,
    error,
    loading,
    formRef,
  };
}
