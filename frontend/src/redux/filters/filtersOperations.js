import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseApiUrl } from '../axiosConfig';

export const getFiltersCategory = createAsyncThunk(
  'categories/filtersCategory',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${baseApiUrl}/filters/?category_id=${id}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
