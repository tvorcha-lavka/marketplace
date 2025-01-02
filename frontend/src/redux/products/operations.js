import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { baseApiUrl } from '../axiosConfig.js';

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (
    { page = 1, page_size = 24, category = null, is_vip = null },
    thunkAPI
  ) => {
    try {
      const params = { page, page_size };
      if (category) params.category = category;
      if (is_vip !== null) params.is_vip = is_vip;

      const res = await axios.get(`${baseApiUrl}/products/`, { params });

      return res.data.results;
    } catch (e) {
      console.error('Error fetching products:', e);
      return thunkAPI.rejectWithValue(e.message);
    }
  },
  {
    condition: (arg, { getState }) => {
      const state = getState();
      return !state.product.loading;
    },
  }
);

export const getProductsId = createAsyncThunk(
  'product/getProductsId',
  async (productId, thunkAPI) => {
    try {
      const res = await axios.get(`${baseApiUrl}/products/${productId}/`);

      return res.data;
    } catch (e) {
      console.error('Error fetching product by ID:', e);
      return thunkAPI.rejectWithValue(e.message);
    }
  },
  {
    condition: (arg, { getState }) => {
      const state = getState();
      return !state.product.loading;
    },
  }
);
