// Import fungsi yang dibutuhkan dari Firebase SDK
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // 🚀 Tambahkan GoogleAuthProvider di sini
import { getAnalytics, isSupported } from "firebase/analytics";

// Konfigurasi Web App Firebase JasaNet milikmu
const firebaseConfig = {
  apiKey: "AIzaSyAMCe3cjK_90gFjxSZTPv_GpOzDyxbEs2k",
  authDomain: "jasanet-ccc2f.firebaseapp.com",
  projectId: "jasanet-ccc2f",
  storageBucket: "jasanet-ccc2f.firebasestorage.app",
  messagingSenderId: "251176321014",
  appId: "1:251176321014:web:d502002f414d2e1df451d7",
  measurementId: "G-Q8MXWXQGYH"
};

// 1. Inisialisasi Firebase (Mencegah inisialisasi ganda saat Next.js hot-reload)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 2. Inisialisasi Firestore Database (Dipakai oleh API Route /api/contact)
const db = getFirestore(app);

// 3. Inisialisasi Firebase Authentication
const auth = getAuth(app); 

// 🚀 Inisialisasi Google Auth Provider untuk login client
const googleProvider = new GoogleAuthProvider();

// 4. Inisialisasi Analytics secara aman (Hanya berjalan di sisi Browser/Client)
let analytics = null;
if (typeof window !== "undefined") {
  // Cek apakah browser mendukung firebase analytics (mencegah error di SSR)
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(err => console.error("Firebase Analytics tidak didukung:", err));
}

// Ekspor semua instance agar bisa dipakai di frontend maupun backend API
// 🚀 PASTIKAN auth DAN googleProvider IKUT DI-EXPORT
export { app, db, auth, googleProvider, analytics };