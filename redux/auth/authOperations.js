import { createAsyncThunk } from '@reduxjs/toolkit';

// Firebase
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { app, auth, auth2, database, db, getUrlofUploadedAvatar, storage } from '../../firebase/config';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// FirebaseLogin
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { getRefreshUserAction } from './authActions';

export const register = createAsyncThunk('auth/register', async (state, thunkAPI) => {
  try {
    const {user} = await createUserWithEmailAndPassword(auth, state.email, state.password);
    await updateProfile(user, { displayName: state.login, photoURL: state.photo ?? state.photo });
    const photoUrl = state.photo ? await getUrlofUploadedAvatar(state.photo, user.uid) : '';
    const uploadedInfo = { ...state, name: state.login, photo: photoUrl, userId: user.uid };
    console.log('uploadedInfo when register :>> ', uploadedInfo);
    
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, uploadedInfo);
    console.log('uploadedInfo :>> ', uploadedInfo);
    return uploadedInfo;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
          // const userRef = doc(db, 'users', user.uid);
          // const docSnap = await getDoc(userRef);
    // const existingData = docSnap.data();

        // console.log('existingData.userId :>> ', existingData.userId);
        // console.log('user.uid :>> ', user.uid);
    return {
      // userId: user.uid,
      // name: user.displayName,
      // email: user.email,
      // photo: user.photoURL,
    };

    // return existingData;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const update = createAsyncThunk('auth/update', async ({ userId, state }, thunkAPI) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    const existingData = docSnap.data();
    let uploadedInfo = { ...existingData };

    for (const field in state) {
      if (
        // state.hasOwnProperty(field) &&
        // state[field] &&
        // state[field] !== '' &&
        existingData.hasOwnProperty(field) &&
        existingData[field] !== state[field]
      ) {
        if (Array.isArray(existingData[field])) {
          // uploadedInfo[field] = [...existingData[field], state[field]];
          const updatedField = existingData[field].filter(item => item !== state[field]);
          updatedField.push(state[field]);
          uploadedInfo[field] = updatedField;
        } else {
          uploadedInfo[field] = [existingData[field], state[field]];
        }
      } else if (!existingData.hasOwnProperty(field) && state[field] !== '') {
        uploadedInfo[field] = state[field];
      }
    }
    updateProfile(auth.currentUser, { photoURL: state.photo ?? state.photo });
    await updateDoc(userRef, uploadedInfo);
    // return {
    //   photo: state.photo ? state.photo : existingData.photo,
    // };
    return uploadedInfo; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await signOut(auth);
    return;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const refresh = () =>  (dispatch) => {
  try {
    console.log('Виконуємо рефреш');
    // const unsubscribe =
      onAuthStateChanged(auth, async user => {
      if (user) {
        console.log('Користувач залогінений:', user.uid);
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      const existingData = docSnap.data();

      let userData = {};
        for (const field in existingData) {
          userData[field] = existingData[field];
        }
        // return userData;
        dispatch(getRefreshUserAction(existingData));
        console.log('existingData in refresh :>> ', existingData);
      }
      else {
        console.log('Користувач вийшов з системи або ще не увійшов');
        // dispatch(
        //   handleRejectedRefreshing({
        //     userId: '',
        //     name: '',
        //     email: '',
        //     photo: '',
        //     isLoggedIn: false,
        //   })
        // );
      }
    });
    // return () => {
    //   unsubscribe();
    // };
  } catch (error) {
    // return thunkAPI.rejectWithValue(error.message);
    console.log(error.toString());
  }
};


// export const refresh = () => dispatch => {
//   // try {
//   //   // console.log('Виконуємо рефреш');
//   //   onAuthStateChanged(auth2, user => {
//   //     // const user2 = auth;
//   //     // const user2 = user?.reload();
//   //     // const user2 = auth?.currentUser?.getIdToken(true);
//   //     // console.log('user2 в рефреш :>> ', user2);
//   //     if (user) {
//   //       const userData = {
//   //         userId: user.uid,
//   //         name: user.displayName,
//   //         email: user.email,
//   //         photo: user.photoURL,
//   //       };
//   //       dispatch(refreshUser(userData));
//   //     }
//   //   });
//   // } catch (err) {
//   //   console.log(err.toString());
//   // }
// };

WebBrowser.maybeCompleteAuthSession();
export const loginWithGoogle = createAsyncThunk('auth/loginWithGoogle', async (req, thunkAPI) => {
  try {
    const [request, response, promptAsync] = Google.useAuthRequest({
      androidClientId: '750126251136-p8p4ibgra5ur49j93vdsaoj3qf5e20s6.apps.googleusercontent.com',
      iosClientId: '750126251136-kelln54601b7dok4ee6idojqdpoe1lbk.apps.googleusercontent.com',
      expoClientId: '750126251136-6glaaagrp1q3q4ev0k0fqdt0en5ncluq.apps.googleusercontent.com',
    });

    if (response?.type === 'success') {
      const token = response.authentication.accessToken;
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();

      const userData = {
        name: user.name,
        email: user.email,
        photo: user.picture,
      };

      return userData;
    }

    // // const provider = new GoogleAuthProvider();
    // // const res = await signInWithPopup(auth, provider)
    // const res = await signInWithPopup(auth, new GoogleAuthProvider());
    // // const credential = GoogleAuthProvider.credentialFromResult(res);
    // // const token = credential.accessToken;
    // const user = res.user;

    // const userData = {
    //   userId: user.uid,
    //   name: user.displayName,
    //   email: user.email,
    //   photo: user.photoURL,
    // };
    // // const userRef = doc(db, 'users', user.uid);
    // // await setDoc(userRef, userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// export const forgotPassword = createAsyncThunk('user/forgotPassword', async (email: string) => {
//   await sendPasswordResetEmail(auth, email);
// });
// https://github.com/karthickthankyou/zillow-clone-safe/blob/d78234139d8b872d0c1af7a4ae408c6230ea81eb/src/store/user/userActions.ts#L1
