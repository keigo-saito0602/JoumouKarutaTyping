import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

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
    apiKey: firebaseApiKey,
    authDomain: firebaseAuthDomain,
    projectId: firebaseProjectId,
    storageBucket: firebaseStorageBucket,
    messagingSenderId: firebaseMessagingSenderId,
    appId: firebaseAppId,
    measurementId: firebaseMeasurementId,
  });

  const auth = getAuth(firebaseApp);
  const storage = getStorage(firebaseApp);
  const analytics = getAnalytics(firebaseApp);
  const db = getFirestore(firebaseApp);

  nuxtApp.provide("firebaseApp", firebaseApp);
  nuxtApp.provide("auth", auth);
  nuxtApp.provide("storage", storage);
  nuxtApp.provide("analytics", analytics);
  nuxtApp.provide("db", db);
});
