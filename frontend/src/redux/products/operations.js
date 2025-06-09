import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { baseApiUrl } from '../axiosConfig.js';

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (
    {
      page = 1,
      page_size = 24,
      category = null,
      filters_in = [],
      min_price = null,
      max_price = null,
      order_by = null,
      seller = null,
      is_vip = null,
    },
    thunkAPI
  ) => {
    try {
      const params = { page, page_size };

      if (category) params.category = category;
      if (filters_in.length) params.filters_in = filters_in.join(',');
      if (min_price !== null) params.min_price = min_price;
      if (max_price !== null) params.max_price = max_price;
      if (order_by) params.order_by = order_by;
      if (seller) params.seller = seller;
      if (is_vip !== null) params.vip_status = is_vip;

      const res = await axios.get(`${baseApiUrl}/products/`, { params });

      return res.data;
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

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (productData, thunkAPI) => {
    try {
      const res = await axios.post(
        `${baseApiUrl}/products/create/`,
        productData
      );

      return res.data;
    } catch (e) {
      if (e.response) {
        console.error('Server response:', e.response.data);
      }
      console.error('Error creating product:', e.message);
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);