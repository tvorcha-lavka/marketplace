import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { baseApiUrl } from '../axiosConfig.js';

export const searchProducts = createAsyncThunk(
  'search/searchProducts',
  async (query, thunkAPI) => {
    try {
      const res = await axios.get(`${baseApiUrl}/search/`, {
        params: { query },
      });

      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message || 'Search error');
    }
  }
);
