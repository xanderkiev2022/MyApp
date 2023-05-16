import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDJw1Z50ycOABR26n5s4256k7-_EJxl3H8',
  authDomain: 'webringitapp.firebaseapp.com',
  databaseURL: 'https://webringitapp-default-rtdb.firebaseio.com',
  projectId: 'webringitapp',
  storageBucket: 'webringitapp.appspot.com',
  messagingSenderId: '750126251136',
  appId: '1:750126251136:web:1e1c3f5e65967f38573a65',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);
