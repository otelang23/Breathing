import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// TODO: Replace with your actual Firebase project config or use environment variables
// For now, these are placeholders. The app will throw an error if you try to use auth without setting these.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD-PLACEHOLDER",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "breathing-app-placeholder.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "breathing-app-placeholder",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "breathing-app-placeholder.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
