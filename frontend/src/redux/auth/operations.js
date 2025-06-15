import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  baseApiUrl,
  saveTokensToStorage,
  setAuthHeader,
} from '../axiosConfig.js';

export const register = createAsyncThunk(
  'auth/register',
  async (newUser, thunkAPI) => {
    try {
      const res = await axios.post(`${baseApiUrl}/auth/sign-up/`, newUser);
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const registerComplete = createAsyncThunk(
  'auth/registerComplete',
  async ({ code, email }, thunkAPI) => {
    try {
      const res = await axios.post(`${baseApiUrl}/auth/sign-up/complete/`, {
        code,
        email,
      });
      const accessToken = res.data.token.access;
      const refreshToken = res.data.token.refresh;

      saveTokensToStorage(accessToken, refreshToken);

      setAuthHeader(accessToken);

      const user = res.data.user;
      return { user, accessToken, refreshToken };
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const logIn = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const res = await axios.post(`${baseApiUrl}/auth/login/`, credentials);

      const accessToken = res.data.access;
      const refreshToken = res.data.refresh;

      saveTokensToStorage(accessToken, refreshToken);

      setAuthHeader(accessToken);

      return { accessToken, refreshToken };
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const logOut = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      const reduxState = thunkAPI.getState();
      const persistedRefreshToken = reduxState.auth.refreshToken;

      await axios.post(`${baseApiUrl}/auth/logout/`, {
        refresh: persistedRefreshToken,
      });

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      delete axios.defaults.headers.common.Authorization;

      return true;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
  {
    condition(_, thunkAPI) {
      const reduxState = thunkAPI.getState();
      return reduxState.auth.refreshToken !== null;
    },
  }
);

export const refreshUser = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    const reduxState = thunkAPI.getState();
    const persistedRefreshToken = reduxState.auth.refreshToken;

    if (!persistedRefreshToken) {
      return thunkAPI.rejectWithValue('Unable to fetch refresh user');
    }

    try {
      const res = await axios.post(`${baseApiUrl}/auth/token/refresh/`, {
        refresh: persistedRefreshToken,
      });
      const newAccessToken = res.data.access;

      saveTokensToStorage(newAccessToken, persistedRefreshToken);

      setAuthHeader(newAccessToken);
      return {
        accessToken: newAccessToken,
        refreshToken: persistedRefreshToken,
      };
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return thunkAPI.rejectWithValue('Refresh token is invalid.');
      } else {
        return thunkAPI.rejectWithValue('Error during token refresh.');
      }
    }
  },
  {
    condition(_, thunkAPI) {
      const reduxState = thunkAPI.getState();
      return reduxState.auth.refreshToken !== null;
    },
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgot-password',
  async (user, thunkAPI) => {
    try {
      const res = await axios.post(
        `${baseApiUrl}/send-mail/password-recovery/`,
        user
      );
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const verifyCode = createAsyncThunk(
  'auth/verifyCode',
  async ({ code, email }, thunkAPI) => {
    try {
      const res = await axios.post(`${baseApiUrl}/auth/verify-code/`, {
        code,
        email,
      });
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const passwordRecovery = createAsyncThunk(
  'auth/password-recovery',
  async ({ email, code, password }, thunkAPI) => {
    try {
      const res = await axios.post(`${baseApiUrl}/auth/password/recovery/`, {
        email,
        code,
        password,
      });
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const resendRegisterCode = createAsyncThunk(
  'auth/resend-code',
  async (user, thunkAPI) => {
    try {
      const res = await axios.post(
        `${baseApiUrl}/send-mail/email-verification/`,
        user
      );
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const fetchGoogleAuthUrl = createAsyncThunk(
  'auth/fetchGoogleAuthUrl',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${baseApiUrl}/auth/login/google/`);

      return res.data.auth_url;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const logInWithGoogleComplete = createAsyncThunk(
  'auth/logInWithGoogleComplete',
  async ({ code, state }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${baseApiUrl}/auth/login/google/complete/`,
        {
          state,
          code,
        }
      );

      const accessToken = res.data.token.access;
      const refreshToken = res.data.token.refresh;
      const user = res.data.user;

      saveTokensToStorage(accessToken, refreshToken);

      setAuthHeader(accessToken);

      return { user, accessToken, refreshToken };
    } catch (e) {
      console.error(
        'Error logging in with Google:',
        e.response?.data || e.message
      );

      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const fetchFacebookAuthUrl = createAsyncThunk(
  'auth/fetchFacebookAuthUrl',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${baseApiUrl}/auth/login/facebook/`);

      return res.data.auth_url;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const logInWithFacebookComplete = createAsyncThunk(
  'auth/logInWithFacebookComplete',
  async ({ code, state }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${baseApiUrl}/auth/login/facebook/complete/`,
        {
          state,
          code,
        }
      );
      const accessToken = res.data.token.access;
      const refreshToken = res.data.token.refresh;
      const user = res.data.user;

      saveTokensToStorage(accessToken, refreshToken);

      setAuthHeader(accessToken);

      return { user, accessToken, refreshToken };
    } catch (e) {
      console.error(
        'Error logging in with Facebook:',
        e.response?.data || e.message
      );

      return thunkAPI.rejectWithValue(e.message);
    }
  }
);
