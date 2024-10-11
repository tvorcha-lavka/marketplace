import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

axios.defaults.baseURL = 'http://localhost:8000/api';

const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

const saveTokensToStorage = (accessToken, refreshToken) => {
  if (isLocalStorageAvailable()) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
};

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
      const res = await axios.post('/auth/sign-up/', newUser);
      return res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        return thunkAPI.rejectWithValue(
          'Email is already registered. Please use a different email.'
        );
      }
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
      if (e.response && e.response.status === 400) {
        return thunkAPI.rejectWithValue(
          'Invalid confirmation code. Please try again.'
        );
      }
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const logIn = createAsyncThunk(
  'auth/login',
  async ({ email, password, remember_me }, thunkAPI) => {
    try {
      const res = await axios.post('/auth/login/', {
        email,
        password,
        remember_me,
      });
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

export const logOut = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await axios.post('/auth/logout/');
    clearAuthHeader();

    const keysToRemove = ['accessToken', 'refreshToken'];
    if (isLocalStorageAvailable()) {
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    }
  } catch (e) {
    console.error('Logout failed:', e);
    return thunkAPI.rejectWithValue(e.message);
  }
});

export const refreshUser = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    const reduxState = thunkAPI.getState();
    const persistedAccessToken = reduxState.auth.accessToken;
    const persistedRefreshToken = reduxState.auth.refreshToken;

    const { openModal } = thunkAPI.extra;

    if (!persistedRefreshToken) {
      thunkAPI.dispatch(logoutUser());

      if (openModal) {
        openModal('login');
      }

      return thunkAPI.rejectWithValue('Refresh token missing. Logging out...');
    }

    if (!persistedAccessToken) {
      try {
        const res = await axios.post('/auth/token/refresh/', {
          refresh: persistedRefreshToken,
        });

        setAuthHeader(res.data.access);
        return res.data;
      } catch (error) {
        thunkAPI.dispatch(logoutUser());

        if (openModal) {
          openModal('login');
        }
        return thunkAPI.rejectWithValue(
          'Unable to refresh token. Logging out...'
        );
      }
    }

    setAuthHeader(persistedAccessToken);
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
