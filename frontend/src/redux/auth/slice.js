import { createSlice } from '@reduxjs/toolkit';
import {
  register,
  registerComplete,
  logIn,
  logOut,
  refreshUser,
  forgotPassword,
  verifyCode,
  resetPassword,
  resendRegisterCode,
  fetchGoogleAuthUrl,
  logInWithGoogleComplete,
  fetchFacebookAuthUrl,
  logInWithFacebookComplete,
} from './operations';

const handlePending = (state) => {
  state.loading = true;
  state.error = false;
};

const handleFulfilled = (state, action) => {
  state.user = action.payload;
  state.isRefreshing = false;
  state.isLoggedOut = true;
  state.isLoggedIn = false;
  state.loading = false;
  state.error = false;
};

const handleFulfilledAuth = (state, action) => {
  state.user = action.payload;
  state.accessToken = action.payload.accessToken;
  state.refreshToken = action.payload.refreshToken;
  state.isRefreshing = false;
  state.isLoggedOut = false;
  state.isLoggedIn = true;
  state.loading = false;
  state.error = false;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      email: null,
      password: null,
      remember_me: false,
    },
    code: null,
    accessToken: null,
    refreshToken: null,
    isLoggedIn: false,
    isLoggedOut: false,
    isRefreshing: false,
    loading: false,
    error: false,
  },
  reducers: {
    setVerificationCode: (state, action) => {
      state.code = action.payload;
    },
    updateTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, handleFulfilled)
      .addCase(register.rejected, handleRejected)

      .addCase(registerComplete.pending, handlePending)
      .addCase(registerComplete.fulfilled, handleFulfilledAuth)
      .addCase(registerComplete.rejected, handleRejected)

      .addCase(logIn.pending, handlePending)
      .addCase(logIn.fulfilled, handleFulfilledAuth)
      .addCase(logIn.rejected, handleRejected)

      .addCase(logOut.pending, handlePending)
      .addCase(logOut.fulfilled, (state) => {
        state.user = { email: null, password: null };
        state.accessToken = null;
        state.refreshToken = null;
        state.isRefreshing = false;
        state.isLoggedOut = true;
        state.isLoggedIn = false;
        state.loading = false;
        state.error = false;
      })
      .addCase(logOut.rejected, handleRejected)

      .addCase(refreshUser.pending, (state) => {
        state.isRefreshing = true;
        state.loading = true;
        state.error = false;
      })
      .addCase(refreshUser.fulfilled, handleFulfilledAuth)
      .addCase(refreshUser.rejected, handleRejected)

      .addCase(forgotPassword.pending, handlePending)
      .addCase(forgotPassword.fulfilled, handleFulfilled)
      .addCase(forgotPassword.rejected, handleRejected)

      .addCase(verifyCode.pending, handlePending)
      .addCase(verifyCode.fulfilled, handleFulfilled)
      .addCase(verifyCode.rejected, handleRejected)

      .addCase(resetPassword.pending, handlePending)
      .addCase(resetPassword.fulfilled, (state) => {
        state.code = null;
        state.loading = false;
        state.error = false;
      })
      .addCase(resetPassword.rejected, handleRejected)

      .addCase(resendRegisterCode.pending, handlePending)
      .addCase(resendRegisterCode.fulfilled, handleFulfilled)
      .addCase(resendRegisterCode.rejected, handleRejected)

      .addCase(fetchGoogleAuthUrl.pending, handlePending)
      .addCase(fetchGoogleAuthUrl.fulfilled, handleFulfilled)
      .addCase(fetchGoogleAuthUrl.rejected, handleRejected)

      .addCase(logInWithGoogleComplete.pending, handlePending)
      .addCase(logInWithGoogleComplete.fulfilled, handleFulfilledAuth)
      .addCase(logInWithGoogleComplete.rejected, handleRejected)

      .addCase(fetchFacebookAuthUrl.pending, handlePending)
      .addCase(fetchFacebookAuthUrl.fulfilled, handleFulfilled)
      .addCase(fetchFacebookAuthUrl.rejected, handleRejected)

      .addCase(logInWithFacebookComplete.pending, handlePending)
      .addCase(logInWithFacebookComplete.fulfilled, handleFulfilledAuth)
      .addCase(logInWithFacebookComplete.rejected, handleRejected);
  },
});

export const { setVerificationCode, updateTokens, setRefreshing } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
