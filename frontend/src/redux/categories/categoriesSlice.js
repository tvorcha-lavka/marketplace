import { createSlice } from '@reduxjs/toolkit';
import {
  getAllCategoriesWithPopular,
  getCategoryById,
} from './categoriesOperations';

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    popular: [],
    categoryById: {},
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategoriesWithPopular.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategoriesWithPopular.fulfilled, (state, action) => {
        state.items = action.payload.allCategories;
        state.popular = action.payload.popularCategories;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllCategoriesWithPopular.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.categoryById = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const categoriesReducer = categoriesSlice.reducer;
