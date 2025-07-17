import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { buildCategoryTree } from '../../utils/tree';
import { baseApiUrl } from '../axiosConfig';

export const getAllCategoriesWithPopular = createAsyncThunk(
  'categories/getAllWithPopular',
  async (_, thunkAPI) => {
    try {
      const allCategoriesRes = await axios.get(`${baseApiUrl}/categories/`);
      const popCategoriesRes = await axios.get(`${baseApiUrl}/categories/`, {
        params: { popular: true },
      });

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

export const getCatalog = createAsyncThunk(
  'categories/getCatalog',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${baseApiUrl}/categories/catalog/`);
      const tree = res.data;
      const categoryTrees = buildCategoryTree(tree);

      return {
        tree: categoryTrees,
        flat: tree,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
