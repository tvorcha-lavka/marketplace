import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {buildCategoryTree} from '../../utils/tree.js'

axios.defaults.baseURL = 'http://localhost:8000/api';



export const getAllCategories = createAsyncThunk(
  'categories/allCategories',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        `/categories/?lang=uk`);
      
      // return res.data
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