import { axios } from '../axiosConfig.js';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

export const saveTokensToStorage = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  axios.defaults.headers.common.Authorization = '';
};

export const register = createAsyncThunk(
  'auth/register',
  async (newUser, thunkAPI) => {
    try {
      const res = await axios.post('/auth/sign-up/', newUser);
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
      const res = await axios.post('/auth/sign-up/complete/', {
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
      const res = await axios.post('/auth/login/', credentials);

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
  async (openModal, thunkAPI) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      console.log('Logout refreshToken:', refreshToken);

      await axios.post('/auth/logout/', { refresh: refreshToken });

      toast.error('Logging out...');

      clearAuthHeader();

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      openModal('login');
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const refreshUser = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    const reduxState = thunkAPI.getState();
    const persistedToken = reduxState.auth.refreshToken;

    if (!persistedToken) {
      return thunkAPI.rejectWithValue('Unable to fetch refresh user');
    }

    const res = await axios.post('/auth/token/refresh/', {
      refresh: persistedToken,
    });
    const newAccessToken = res.data.access;

    setAuthHeader(newAccessToken);
    return res.data;
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
      const res = await axios.post('/send-mail/reset-password/', user);
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
      const res = await axios.post('/auth/verify-code/', { code, email });
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
      const res = await axios.post('/auth/reset/password/', {
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
      const res = await axios.post('/send-mail/email-verification/', user);
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data || e.message);
    }
  }
);
