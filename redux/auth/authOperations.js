import { createAsyncThunk } from '@reduxjs/toolkit';

// Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/config';

export const register = createAsyncThunk('auth/register', async ({ login, email, password }, thunkAPI) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    console.log('Користувач успішно зареєстрований:', user.uid);
    await updateProfile(user, {displayName: login, });
    return {
      userId: user.uid,
      name: user.displayName,
      email: user.userEmail,
      photo: user.photoURL,
    };
  } catch (error) {
    console.log('Помилка при реєстрації:', error.message);
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;
    console.log('Користувач успішно залогінився:', user.uid);
    return {
      userId: user.uid,
      name: user.displayName,
      email: user.userEmail,
      photo: user.photoURL,
    };
  } catch (error) {
    console.log('Помилка при вході:', error.message);
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
