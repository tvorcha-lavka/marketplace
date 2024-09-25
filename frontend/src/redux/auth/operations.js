import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

axios.defaults.baseURL = 'http://localhost:8000';

const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  axios.defaults.headers.common.Authorization = '';
};

export const register = createAsyncThunk(
  'auth/register',
  async (newUser, thunkAPI) => {
    try {
      const res = await axios.post('/api/auth/sign-up/', newUser);
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
      const res = await axios.post('/api/auth/sign-up/complete/', {
        code,
        email,
      });
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const logIn = createAsyncThunk(
  'auth/login',
  async ({ user, userRemember }, thunkAPI) => {
    try {
      const res = await axios.post('/api/auth/login/', user);
      const accessToken = res.data.access;
      setAuthHeader(accessToken);
      localStorage.setItem('accessToken', accessToken);

      if (userRemember) {
        localStorage.setItem('email', user.email);
        localStorage.setItem('password', user.password);
      } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }

      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const logOut = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await axios.post('/api/auth/logout/');
    clearAuthHeader();
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

export const refreshUser = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    const reduxState = thunkAPI.getState();
    const persistedToken = reduxState.auth.token;

    if (!persistedToken) {
      return thunkAPI.rejectWithValue('Unable to fetch user');
    }
    setAuthHeader(persistedToken);

    const res = await axios.get('/api/auth/token/refresh/');
    return res.data;
  },
  {
    condition(_, thunkAPI) {
      const reduxState = thunkAPI.getState();
      return reduxState.auth.token !== null;
    },
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgot-password',
  async (user, thunkAPI) => {
    try {
      const res = await axios.post('/api/send-mail/reset-password/', user);
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const verifyCode = createAsyncThunk(
  'auth/verifyCode',
  async ({ code, email }, thunkAPI) => {
    try {
      const res = await axios.post('/api/auth/verify-code/', { code, email });
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/reset-password',
  async ({ email, code, password }, thunkAPI) => {
    try {
      const res = await axios.post('/api/auth/reset/password/', {
        email,
        code,
        password,
      });
      const accessToken = res.data.access;
      setAuthHeader(accessToken);
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const resendRegisterCode = createAsyncThunk(
  'auth/resend-code',
  async (user, thunkAPI) => {
    try {
      const res = await axios.post('/api/send-mail/email-verification/', user);
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);