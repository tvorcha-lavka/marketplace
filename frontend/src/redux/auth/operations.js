import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { baseApiUrl } from '../axiosConfig.js';

const saveTokensToStorage = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

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

      await axios.post(
        `${baseApiUrl}/auth/logout/`,
        {
          refresh: persistedRefreshToken,
        },
        {
          headers: {
            Authorization: '',
          },
        }
      );

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete axios.defaults.headers.common.Authorization;
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
        `${baseApiUrl}/send-mail/reset-password/`,
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

export const resetPassword = createAsyncThunk(
  'auth/reset-password',
  async ({ email, code, password }, thunkAPI) => {
    try {
      const res = await axios.post(`${baseApiUrl}/auth/reset/password/`, {
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
