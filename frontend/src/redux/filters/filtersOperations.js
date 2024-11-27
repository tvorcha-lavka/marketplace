import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { buildCategoryTree } from '../../utils/tree.js';
import { baseApiUrl } from '../axiosConfig';

export const getFiltersCategory = createAsyncThunk(
  'categories/filtersCategory',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${baseApiUrl}/filters/?category_id=${id}`);
      console.log(res.data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
