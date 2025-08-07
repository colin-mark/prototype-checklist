// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZ3DCcmH3vLsm5ZGN-HCoGxU8FlESdpkA",
  authDomain: "colin-mark-website.firebaseapp.com",
  projectId: "colin-mark-website",
  storageBucket: "colin-mark-website.firebasestorage.app",
  messagingSenderId: "414832445983",
  appId: "1:414832445983:web:389786e19e367e3b86e32a",
  measurementId: "G-JNN5K5KRXC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
