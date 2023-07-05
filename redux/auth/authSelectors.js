export const selectUserId = state => state.auth.userId;
export const selectName = state => state.auth.name;
export const selectEmail = state => state.auth.email;
export const selectPhoto = state => state.auth.photo;
export const selectIsLoggedIn = state => state.auth.isLoggedIn;
export const selectIsLoading = state => state.auth.isLoading;
export const selectError = state => state.auth.error;
export const selectRefreshing = state => state.auth.isRefreshing;
export const selectPass = state => state.auth.password;
export const selectPhone = state => state.auth.phone;
export const selectDOB = state => state.auth.birth;

export const selectUserData = state => state.auth;

export const selectDatabase = state => state.auth.database;