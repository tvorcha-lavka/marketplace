import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { buildCategoryTree } from '../../utils/tree.js';
import { baseApiUrl } from '../axiosConfig';

export const getAllCategories = createAsyncThunk(
  'categories/getAll',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${baseApiUrl}/categories/?lang=uk`);

      const tree = res.data;
      const categoryTrees = buildCategoryTree(tree);

      const categories = categoryTrees[0].children;
      // console.log(categories);
      return categories;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getCategoryById = createAsyncThunk(
  'categories/getOne',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${baseApiUrl}/categories/${id}/`);
      // console.log(res.data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
