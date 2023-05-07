
export const selectUserId = state => state.auth.id;
export const selectName = state => state.auth.name;
export const selectEmail = state => state.auth.email;
export const selectPhoto = state => state.auth.photo;
export const selectIsLoggedIn = state => state.auth.isLoggedIn;
export const selectIsLoading = state => state.auth.isLoading;
export const selectError = state => state.auth.error;