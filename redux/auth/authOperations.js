import { createAsyncThunk } from '@reduxjs/toolkit';

// Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, getAuth } from 'firebase/auth';
import { auth } from '../../firebase/config';

export const register = createAsyncThunk('auth/register', async ({ login, email, password }, thunkAPI) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await updateProfile(user, {
      displayName: login,
      // photoURL: 'https://i.pravatar.cc/300'
    });
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

export const update = createAsyncThunk('auth/update', async ({photoUrl}, thunkAPI) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      await updateProfile(currentUser, {
        photoURL: photoUrl,
      });
      console.log('Profile updated successfully');
          return {
            photo: photoUrl,
    };
    } else {
      console.log('User is not authenticated');
    }
  }
   catch (error) {
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

export const refresh = createAsyncThunk('auth/refresh', async (_, { dispatch }) => {
  try {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        console.log('Користувач залогінений:', user.uid);
        dispatch(
          setUser({
            userId: user.uid,
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            isLoggedIn: true,
          })
        );
      } else {
        console.log('Користувач вийшов з системи або ще не увійшов');
        dispatch(
          setUser({
            userId: '',
            name: '',
            email: '',
            photo: '',
            isLoggedIn: false,
          })
        );
      }
    });
    return () => {
      unsubscribe();
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
