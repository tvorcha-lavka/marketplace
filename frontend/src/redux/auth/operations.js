import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

//axios.defaults.baseURL = 'http://localhost:3000';

const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

// const clearAuthHeader = () => {
//   axios.defaults.headers.common.Authorization = '';
// };

export const register = createAsyncThunk(
  'user/register',
  async (newUser, thunkAPI) => {
    console.log(newUser);
    try {
      const res = await axios.post('/auth/register', newUser);
      setAuthHeader(res.data.token);
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

// export const logIn = createAsyncThunk(
//   'user/login',
//   async (credentials, thunkAPI) => {
//     try {
//       const res = await axios.post('/auth/login', credentials);
//       setAuthHeader(res.data.token);
//       return res.data;
//     } catch (e) {
//       return thunkAPI.rejectWithValue(e.message);
//     }
//   }
// );

// export const logOut = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
//   try {
//     await axios.post('/users/logout');
//     clearAuthHeader();
//   } catch (e) {
//     return thunkAPI.rejectWithValue(e.message);
//   }
// });

// export const refreshUser = createAsyncThunk(
//   'auth/refresh',
//   async (_, thunkAPI) => {
//     const reduxState = thunkAPI.getState();
//     const persistedToken = reduxState.auth.token;

//     if (!persistedToken) {
//       return thunkAPI.rejectWithValue('Unable to fetch user');
//     }
//     setAuthHeader(persistedToken);

//     const res = await axios.get('/users/current');
//     return res.data;
//   },
//   {
//     condition(_, thunkAPI) {
//       const reduxState = thunkAPI.getState();
//       return reduxState.auth.token !== null;
//     },
//   }
// );
