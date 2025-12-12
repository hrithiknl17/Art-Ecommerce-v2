import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCeFHGet_wTP-zrp9wI-cCC8xQ-Hq-kaw",
  authDomain: "art-ecommerce-v2.firebaseapp.com",
  projectId: "art-ecommerce-v2",
  storageBucket: "art-ecommerce-v2.firebasestorage.app",
  messagingSenderId: "767514003728",
  appId: "1:767514003728:web:a32f27f5981c251fd67d95",
  measurementId: "G-LLE3MVN5GC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
