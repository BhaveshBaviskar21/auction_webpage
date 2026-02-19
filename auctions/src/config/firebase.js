import { initializeApp } from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';
import {getFirestore} from 'firebase/firestore';

// Use your own configs!
const firebaseConfig = {
  .
  .
  .
  .
  .
  .
};
const app = initializeApp(firebaseConfig)

export const firestoreApp = getFirestore(app);
export const storageApp = getStorage(app);
export const authApp = getAuth(app);
