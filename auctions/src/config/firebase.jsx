import { initializeApp } from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';
import {getFirestore} from 'firebase/firestore';

// Use your own configs!
const firebaseConfig = {
  apiKey: "AIzaSyBrzXAIIyLP5DeJyALNrqF4FD6WNZZJemQ",
  authDomain: "auction-website-ab5d6.firebaseapp.com",
  projectId: "auction-website-ab5d6",
  storageBucket: "auction-website-ab5d6.appspot.com",
  messagingSenderId: "506409736189",
  appId: "1:506409736189:web:357dd8e8fe90f8d603ab94",
  measurementId: "G-TG403TZ82R"
};
const app = initializeApp(firebaseConfig)

export const firestoreApp = getFirestore(app);
export const storageApp = getStorage(app);
export const authApp = getAuth(app);
