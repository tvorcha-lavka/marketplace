import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { baseApiUrl } from '../axiosConfig.js';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseApiUrl}?page=${page}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseApiUrl}/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${baseApiUrl}/${id}/`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserSecurity = createAsyncThunk(
  'users/updateUserSecurity',
  async ({ id, phone, oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${baseApiUrl}/${id}/`, {
        phone_number: phone,
        old_password: oldPassword,
        new_password: newPassword,
      });

      return response.data.phone_number;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${baseApiUrl}/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
