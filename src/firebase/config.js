// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAZ3DCcmH3vLsm5ZGN-HCoGxU8FlESdpkA",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "colin-mark-website.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "colin-mark-website",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "colin-mark-website.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "414832445983",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:414832445983:web:389786e19e367e3b86e32a",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-JNN5K5KRXC"
};

// Initialize Firebase
let app;
let db;
let auth;

try {
  console.log('Initializing Firebase with config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    hasApiKey: !!firebaseConfig.apiKey
  });
  
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization failed:', error);
  throw error;
}

// Initialize Firebase services
export { db, auth };
export default app;
