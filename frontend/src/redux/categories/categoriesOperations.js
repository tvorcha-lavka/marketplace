import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { buildCategoryTree } from '../../utils/tree';
import { baseApiUrl } from '../axiosConfig';

export const getAllCategoriesWithPopular = createAsyncThunk(
  'categories/getAllWithPopular',
  async (_, thunkAPI) => {
    try {
      const params = { lang: 'uk' };
      const popularParams = { ...params, popular: true };

      const [allCategoriesRes, popCategoriesRes] = await Promise.all([
        axios.get(`${baseApiUrl}/categories/`, { params }),
        axios.get(`${baseApiUrl}/categories/`, { params: popularParams }),
      ]);

      const tree = allCategoriesRes.data;
      const categoryTrees = buildCategoryTree(tree);
      const categories = categoryTrees[0].children;

      return {
        allCategories: categories,
        popularCategories: popCategoriesRes.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
  {
    condition: (arg, { getState }) => {
      const state = getState();
      return !state.categories.loading; 
    },
  }
);

export const getCategoryById = createAsyncThunk(
  'categories/getOne',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${baseApiUrl}/categories/${id}/`);

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
  {
    condition: (arg, { getState }) => {
      const state = getState();
      return !state.categories.categoryById.loading;
    },
  }
);
