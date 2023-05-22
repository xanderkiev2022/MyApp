import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, uploadBytes, ref } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// console.log('getApps().length :>> ', getApps().length);

// export let authAsyncStorage;
// // Initialize the firebase app if no app exists
// if (!getApps().length) {
//   // Required to use the community AsyncStorage package

//   authAsyncStorage = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
// } else {
//   // getApp();
// }



// export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);
export const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

export const getUrlofUploadedAvatar = async (photo, userId) => {
  const response = await fetch(photo); // дістаємо фото зі стейту
  const file = await response.blob(); // перетворюємо отриману фотографію на об'єкт Blob
  const uniqueId = Date.now().toString(); // генеруємо унікальне ім"я для фото
  const fileName = `${uniqueId}.jpg`; // Використовуємо унікальне ім'я для файлу
  const linkToFile = ref(storage, `avatar/${userId}/${fileName}`); // створюємо посилання на місце збереження фото в Firebase
  await uploadBytes(linkToFile, file); // завантажуємо фото
  const url = await getDownloadURL(linkToFile); // отримуємо URL-адресу завантаженого фото
  return url;
};