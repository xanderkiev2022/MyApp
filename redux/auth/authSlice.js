import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { register, login, update, logout, refresh, loginWithGoogle } from './authOperations';

const initialState = {
  userId: '',
  name: '',
  email: '',
  photo: '',
  password: '',
  isLoggedIn: false,
  isLoading: false,
  isRefreshing: false,
  error: '',
};

const setPayloadValues = (state, payload) => {
  for (const key in payload) {
    if (payload.hasOwnProperty(key)) {
      if (key === 'blackList') {
        state[key] = Array.isArray(payload[key]) ? payload[key] : [payload[key]];
      } else {
        state[key] = Array.isArray(payload[key]) ? payload[key][payload[key].length - 1] : payload[key];
      }
    }
  }
};

const handlePending = state => {
  state.isLoading = true;
};
const handleFulfilled = (state, { payload }) => {
  const { userId, name, email, photo, password } = payload;
  setPayloadValues(state, payload);
  // state.userId = userId;
  // state.name = name;
  // state.email = email;
  // state.photo = photo;
  // state.password = password;
  state.isLoggedIn = true;
  state.isLoading = false;
  state.error = '';
};
const handleRejected = (state, { payload }) => {
  state.error = payload;
  state.isLoading = false;
};
const handleLogoutFulfilled = state => {
  for (const key in state) {
    if (state.hasOwnProperty(key)) {
      state[key] = '';
    }
  }
  state.userId = '';
  state.name = '';
  state.email = '';
  state.photo = '';
  state.password = '';
  state.isLoggedIn = false;
  state.isLoading = false;
};

const handleUserFulfilledUpdate = (state, { payload }) => {
  // const { photo } = payload;
  setPayloadValues(state, payload);
  // state.photo = photo;
  state.error = '';
  state.isLoading = false;
};

const handleRejectedUpdate = (state, { payload }) => {
  state.error = payload;
  state.isLoading = false;
};

const handlePendingUpdate = state => {
  state.isLoading = true;
};

const handleFulfilledLoginWithGoogle = (state, { payload }) => {
  const { userId, name, email, photo } = payload;
  state.userId = userId;
  state.name = name;
  state.email = email;
  state.photo = photo;
  state.error = '';
  state.isLoading = false;
};

const handleRejectedLoginWithGoogle = (state, { payload }) => {
  state.error = payload;
  state.isLoading = false;
};

const handlePendingLoginWithGoogle = state => {
  state.isLoading = true;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    removeError(state) {
      state.error = null;
    },
    refreshUser: (state, { payload }) => {
      // state.userId = payload.userId;
      // state.name = payload.name || null;
      // state.email = payload.email;
      // state.photo = payload.photo;
      setPayloadValues(state, payload);
      state.isLoggedIn = true;
      state.isLoading = false;
      state.error = '';
    },
    refreshAvatar: (state, { payload }) => {
      state.photo = payload.photoOnHardDrive;
    },
    refreshEyeColorFields: (state, { payload }) => {
      state.eyeColorFields = payload;
    },
    // refreshDatabase: (state, { payload }) => {
    //    for (const key in payload) {
    //          state.database[key] = payload[key];
    //    }
    // },
  },
  extraReducers: builder => {
    builder
      .addCase(logout.fulfilled, handleLogoutFulfilled)
      .addCase(update.pending, handlePendingUpdate)
      .addCase(update.fulfilled, handleUserFulfilledUpdate)
      .addCase(update.rejected, handleRejectedUpdate)
      .addCase(loginWithGoogle.pending, handlePendingLoginWithGoogle)
      .addCase(loginWithGoogle.fulfilled, handleFulfilledLoginWithGoogle)
      .addCase(loginWithGoogle.rejected, handleRejectedLoginWithGoogle)
      .addMatcher(isAnyOf(register.pending, login.pending), handlePending)
      .addMatcher(isAnyOf(register.fulfilled, login.fulfilled), handleFulfilled)
      .addMatcher(isAnyOf(register.rejected, login.rejected), handleRejected);
  },
});
export const { removeError, refreshUser, refreshAvatar, refreshEyeColorFields } = authSlice.actions;
export const authReducer = authSlice.reducer;