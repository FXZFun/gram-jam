import { initializeFirestore } from '@firebase/firestore/lite';
import { initializeApp } from '@firebase/app';
import  { collection, getFirestore, addDoc } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCeKpexNFcB0ZBgKLBW0DFE8F34bLLjJHw",
  authDomain: "gramjam-7b408.firebaseapp.com",
  projectId: "gramjam-7b408",
  storageBucket: "gramjam-7b408.appspot.com",
  messagingSenderId: "627588992213",
  appId: "1:627588992213:web:f28fac5f4e8e63ad77a65c"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const leaderboard = collection(db, 'leaderboard');