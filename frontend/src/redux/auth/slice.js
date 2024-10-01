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
} from './operations';

const handlePending = (state) => {
  state.loading = true;
  state.error = false;
};

const handleFulfilled = (state, action) => {
  state.user = action.payload.email;
  state.token = action.payload.token;
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
      code: null,
    },
    token: null,
    isLoggedIn: false,
    isRefreshing: false,
    loading: false,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, handleFulfilled)
      .addCase(register.rejected, handleRejected)

      .addCase(registerComplete.pending, handlePending)
      .addCase(registerComplete.fulfilled, handleFulfilled)
      .addCase(registerComplete.rejected, handleRejected)

      .addCase(logIn.pending, handlePending)
      .addCase(logIn.fulfilled, handleFulfilled)
      .addCase(logIn.rejected, handleRejected)

      .addCase(logOut.pending, handlePending)
      .addCase(logOut.fulfilled, (state) => {
        state.user = { email: null, password: null };
        state.token = null;
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
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.isRefreshing = false;
        state.loading = false;
        state.error = false;
      })

      .addCase(forgotPassword.pending, handlePending)
      .addCase(forgotPassword.fulfilled, handleFulfilled)
      .addCase(forgotPassword.rejected, handleRejected)

      .addCase(verifyCode.pending, handlePending)
      .addCase(verifyCode.fulfilled, handleFulfilled)
      .addCase(verifyCode.rejected, handleRejected)

      .addCase(resetPassword.pending, handlePending)
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(resetPassword.rejected, handleRejected)

      .addCase(resendRegisterCode.pending, handlePending)
      .addCase(resendRegisterCode.fulfilled, handleFulfilled)
      .addCase(resendRegisterCode.rejected, handleRejected);
  },
});

export const authReducer = authSlice.reducer;
