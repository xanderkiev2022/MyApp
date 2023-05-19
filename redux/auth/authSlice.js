import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { register, login, update, logout, refresh } from './authOperations';

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

const handlePending = state => {
  state.isLoading = true;
};
const handleFulfilled = (state, { payload }) => {
  const { userId, name, email, photo, password } = payload;
  state.userId = userId;
  state.name = name;
  state.email = email;
  state.photo = photo;
  state.password = password;
  state.isLoggedIn = true;
  state.isLoading = false;
  state.error = '';
};
const handleRejected = (state, { payload }) => {
  state.error = payload;
  state.isLoading = false;
};
const handleLogoutFulfilled = state => {
  state.userId = '';
  state.name = '';
  state.email = '';
  state.photo = '';
  state.password = '';
  state.isLoggedIn = false;
  state.isLoading = false;
};

const handleUserFulfilledRefreshing = (state, { payload }) => {
  const { userId, name, email, photo, isLoggedIn } = payload;
  state.userId = userId;
  state.name = name;
  state.email = email;
  state.photo = photo;
  state.isLoggedIn = isLoggedIn;
  state.error = '';
  state.isRefreshing = false;
  
};
const handleRejectedRefreshing = (state, action) => {
  state.isRefreshing = false;
};
const handlePendingRefreshing = state => {
  state.isRefreshing = true;
};

const handleUserFulfilledUpdate = (state, { payload }) => {
  const { photo } = payload;
  state.photo = photo;
  state.error = '';
  state.isLoading = false;
};

const handleRejectedUpdate = (state, {payload}) => {
   state.error = payload;
  state.isLoading = false;
};

const handlePendingUpdate = state => {
  state.isLoading = true;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    removeError(state) {
      state.error = null;
    },
    // refreshUser: (state, { payload }) => {
    //   state.user = {
    //     userId: payload.userId,
    //     name: payload.name || null,
    //     email: payload.email,
    //     photo: payload.photo || null,
    //   };
    // },
  },
  extraReducers: builder => {
    builder
      .addCase(logout.fulfilled, handleLogoutFulfilled)
      // .addCase(refresh.pending, handlePendingRefreshing)
      // .addCase(refresh.fulfilled, handleUserFulfilledRefreshing)
      // .addCase(refresh.rejected, handleRejectedRefreshing)
      .addCase(update.pending, handlePendingUpdate)
      .addCase(update.fulfilled, handleUserFulfilledUpdate)
      .addCase(update.rejected, handleRejectedUpdate)
      .addMatcher(isAnyOf(register.pending, login.pending), handlePending)
      .addMatcher(isAnyOf(register.fulfilled, login.fulfilled), handleFulfilled)
      .addMatcher(isAnyOf(register.rejected, login.rejected), handleRejected);
  },
});
export const { removeError } = authSlice.actions;
export const authReducer = authSlice.reducer;
