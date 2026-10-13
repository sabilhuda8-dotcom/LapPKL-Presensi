import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC19Uf4tzz2pHSNInZ7JaOgQRKx44shY3Q",
  authDomain: "catatan-kegiatan-c4328.firebaseapp.com",
  projectId: "catatan-kegiatan-c4328",
  storageBucket: "catatan-kegiatan-c4328.firebasestorage.app",
  messagingSenderId: "57589378470",
  appId: "1:57589378470:web:7b51c4a134aa9e929f7367",
  measurementId: "G-ESW7RJG2XF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
