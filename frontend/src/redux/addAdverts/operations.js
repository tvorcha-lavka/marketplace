import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { baseApiUrl } from '../axiosConfig.js';

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
