import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {buildCategoryTree} from '../../utils/tree.js'

axios.defaults.baseURL = 'http://localhost:8000/api';


export const getAllCategories = createAsyncThunk(
  'categories/getAll',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        `/categories/?lang=uk`);
      
      console.log(res.data)
      const tree = res.data
      const categoryTrees = buildCategoryTree(tree);
        console.log(categoryTrees)
      const categories = categoryTrees[0].children;
      console.log(categories)
        return categories;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getPopCategories = createAsyncThunk(
  'categories/getPop', 
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('/categories/?lang=uk&popular=true');
      console.log(res.data)
      return res.data
      
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)

export const getCategoryById = createAsyncThunk(
  'categories/getOne',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get('/categories/${id}/')
      console.log(res.data)
      
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)
