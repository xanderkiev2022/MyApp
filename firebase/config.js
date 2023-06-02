import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, uploadBytes, ref } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY, AUTH_DOMAIN, DATABASE_URL, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
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

export const provider = new GoogleAuthProvider();
// export const auth = getAuth(app);

export const signInWithGoogle = () =>  {
  
signInWithPopup(auth, provider)
  .then(result => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;


    // console.log('credential :>> ', credential);
    // console.log('token :>> ', token);
    console.log('user :>> ', user);
    console.log('result :>> ', result);
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  })
  .catch(error => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
}