import { createAsyncThunk } from '@reduxjs/toolkit';

// Firebase
import { createUserWithEmailAndPassword, onIdTokenChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { app, auth, auth2, database, db, getUrlofUploadedAvatar, storage } from '../../firebase/config';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

export const register = createAsyncThunk('auth/register', async ({ login, email, password, photo }, thunkAPI) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await updateProfile(user, { displayName: login });
    const photoUrl = photo ? await getUrlofUploadedAvatar(photo, user.uid) : 'https://i.pravatar.cc/300';

    const userData = {
      userId: user.uid,
      name: user.displayName,
      email: user.email,
      photo: photoUrl,
      password,
    };
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, userData);
    return userData;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;
    return {
      userId: user.uid,
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const update = createAsyncThunk('auth/update', async ({ photoURL, userId }, thunkAPI) => {
  try {
    const uploadedInfo = {
      photo: photoURL,
      userId,
    };
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, uploadedInfo);

    await updateProfile(auth.currentUser, { photoURL });
    return {
      photo: photoURL,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// export const update = createAsyncThunk('auth/update', async ({ photoUrl: photoURL }, thunkAPI) => {
//   try {
//     // onAuthStateChanged(auth, (user) => {
//     // const id= user.uid;
//     // console.log('id :>> ', id);
//     // console.log('user :>> ', user);
//     // const user = auth.currentUser;

// //  const user = onAuthStateChanged(auth);
// //  const currentUser = res.currentUser;

//     // const auth = getAuth();
//     const { currentUser } = auth;
//     // await currentUser.getIdToken(true);
//     // console.log('token :>> ', token);
//     // console.log('user :>> ', user);
//     // console.log('auth :>> ', auth);
//     currentUser.getIdToken(true);
//     // then(function (idToken) {
//     await updateProfile(currentUser, { photoURL });
//     // await currentUser.reload();
//     // res.reload()
//     return {
//       photo: photoURL,
//     };
//     // });
//     // console.log('idToken :>> ', idToken);

//     //  user.reload();
//     // console.log('Profile updated successfully');

//     // })
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.message);
//   }
// });

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await signOut(auth);
    return;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// export const refresh = createAsyncThunk('auth/refresh', async (_, { dispatch }) => {
//   try {
//     console.log('Виконуємо рефреш');
//     const unsubscribe = onAuthStateChanged(auth, user => {
//       // if (user) {
//         // console.log('Користувач залогінений:', user.uid);
//         const userData = {
//           userId: user.uid,
//           name: user.displayName,
//           email: user.email,
//           photo: user.photoURL,
//           isLoggedIn: true,
//         };
//         return userData;
//         // handleUserFulfilledRefreshing(userData)
//       // }
//       // else {
//       //   console.log('Користувач вийшов з системи або ще не увійшов');
//       //   dispatch(
//       //     handleRejectedRefreshing({
//       //       userId: '',
//       //       name: '',
//       //       email: '',
//       //       photo: '',
//       //       isLoggedIn: false,
//       //     })
//       //   );
//       // }
//     });
//     return () => {
//       unsubscribe();
//     };
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.message);
//   }
// });

export const refresh = () => dispatch => {
  // try {
  //   // console.log('Виконуємо рефреш');
  //   onAuthStateChanged(auth2, user => {
  //     // const user2 = auth;
  //     // const user2 = user?.reload();
  //     // const user2 = auth?.currentUser?.getIdToken(true);
  //     // console.log('user2 в рефреш :>> ', user2);
  //     if (user) {
  //       const userData = {
  //         userId: user.uid,
  //         name: user.displayName,
  //         email: user.email,
  //         photo: user.photoURL,
  //       };
  //       dispatch(refreshUser(userData));
  //     }
  //   });
  // } catch (err) {
  //   console.log(err.toString());
  // }
};
