import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { baseApiUrl } from '../axiosConfig.js';

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (
    { page = 1, page_size = 24, category = null, vip_status = null },
    thunkAPI
  ) => {
    try {
      const params = { page, page_size };
      if (category) params.category = category;
      if (vip_status !== null) params.vip_status = vip_status; // Додаємо vip_status

      const res = await axios.get(`${baseApiUrl}/products/`, { params });
      return res.data.results;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const getProductsId = createAsyncThunk(
  'product/getProductsId',
  async (productId, thunkAPI) => {
		try {
			console.log('Fetching product with ID:', productId);
      const res = await axios.get(`${baseApiUrl}/products/${productId}`);
      console.log(res);
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);
