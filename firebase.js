import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC19Uf4tzz2pHSNInZ7JaOgQRKx44shY3Q",
  authDomain: "catatan-kegiatan-c4328.firebaseapp.com",
  projectId: "catatan-kegiatan-c4328",
  storageBucket: "catatan-kegiatan-c4328.firebasestorage.app",
  messagingSenderId: "57589378470",
  appId: "1:57589378470:web:7b51c4a134aa9e929f7367",
  measurementId: "G-ESW7RJG2XF"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Ekspor agar bisa digunakan di file lain
export default app;
