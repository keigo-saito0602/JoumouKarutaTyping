import type { Firestore } from "firebase/firestore";

export const useFirestore = (): Firestore => {
  return useNuxtApp().$db as Firestore;
};
