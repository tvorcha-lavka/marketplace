import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {buildCategoryTree} from '../../utils/tree.js'

axios.defaults.baseURL = 'http://localhost:8000/api';



export const getAllCategories = createAsyncThunk(
  'categories/allCategories',
  async (_, thunkAPI) => {
    try {
      const data = await axios.get(
        `/categories/`
        );
        console.log(data)
      const categoryTree = buildCategoryTree(data);
        console.log(categoryTree)
        const categories = categoryTree.flatMap((cat) => cat.children);
        return categories;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);