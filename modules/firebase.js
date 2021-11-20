import { initializeApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";
import { getStorage } from "@firebase/storage";

const config = {
  apiKey: "AIzaSyAcMxzUsJh1oRa38_aLcginEkZK7faejSk",
  authDomain: "daffa-ilhami.firebaseapp.com",
  projectId: "daffa-ilhami",
  storageBucket: "daffa-ilhami.appspot.com",
  messagingSenderId: "438490553401",
  appId: "1:438490553401:web:7cff6da5a5ec52bbc5c1e8",
  measurementId: "G-KD7VRF4CTZ",
};

const app = initializeApp(config);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { config, app, analytics, firestore, auth, storage };
