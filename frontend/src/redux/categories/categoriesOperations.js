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
      console.log(tree);
      const categoryTrees = buildCategoryTree(tree);
      const categories = categoryTrees[0].children;
      console.log(categories);
      return categories;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getCatalog = createAsyncThunk(
  'categories/getCatalog',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${baseApiUrl}/categories/catalog/`);
      const tree = res.data;
      const categoryTrees = buildCategoryTree(tree);
      const catalog = categoryTrees[0].children;
      console.log(catalog);
      return catalog;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getPopCategories = createAsyncThunk(
  'categories/getPop',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        `${baseApiUrl}/categories/?lang=uk&popular=true`
      );

      return res.data;
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
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const filtersCategory = createAsyncThunk(
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
