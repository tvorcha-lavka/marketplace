export const selectLoggedIn = (state) => state.auth.isLoggedIn;

export const selectUser = (state) => state.auth.user;

export const selectRefreshing = (state) => state.auth.isRefreshing;

export const selectLoading = (state) => state.auth.loading;

export const selectError = (state) => state.auth.error;

export const selectVerificationCode = (state) => state.auth.code;

export const selectAccessToken = (state) => state.auth.accessToken;

export const selectRefreshToken = (state) => state.auth.refreshToken;
