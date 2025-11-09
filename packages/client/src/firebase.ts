// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCbNbO5uUCvAtemHYzpi4FTujxhzrmdM5s",
  authDomain: "bluechat-bfd6e.firebaseapp.com",
  projectId: "bluechat-bfd6e",
  storageBucket: "bluechat-bfd6e.firebasestorage.app",
  messagingSenderId: "406622880563",
  appId: "1:406622880563:web:514c34b79160f30a563446",
  measurementId: "G-5RHD8XJDRV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
