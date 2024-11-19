import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { baseApiUrl } from '../axiosConfig.js';

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (page = 1, thunkAPI) => {
    try {
      const res = await axios.get(`${baseApiUrl}/api/products/`, {
        params: { page },
      });
      console.log(res.data.results);
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
      const res = await axios.get(`${baseApiUrl}/api/products/${productId}`);
      console.log(res);
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);
