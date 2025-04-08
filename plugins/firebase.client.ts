import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const {
    firebaseApiKey,
    firebaseAuthDomain,
    firebaseProjectId,
    firebaseStorageBucket,
    firebaseMessagingSenderId,
    firebaseAppId,
    firebaseMeasurementId,
  } = config.public;

  const firebaseApp = initializeApp({
    apiKey: firebaseApiKey as string,
    authDomain: firebaseAuthDomain as string,
    projectId: firebaseProjectId as string,
    storageBucket: firebaseStorageBucket as string,
    messagingSenderId: firebaseMessagingSenderId as string,
    appId: firebaseAppId as string,
    measurementId: firebaseMeasurementId as string,
  });

  const auth = getAuth(firebaseApp);
  const storage = getStorage(firebaseApp);
  const analytics = getAnalytics(firebaseApp);

  // Nuxtアプリに提供（どこでも使えるようにする）
  nuxtApp.provide("firebaseApp", firebaseApp);
  nuxtApp.provide("auth", auth);
  nuxtApp.provide("storage", storage);
  nuxtApp.provide("analytics", analytics);
});
