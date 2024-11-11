import { createSlice } from '@reduxjs/toolkit';
import { getAllCategories, getCategoryById } from './categoriesOperations';

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    categoryById: {},
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.categoryById = action.payload;
        state.loading = false;
        state.error = null;
      });
  },
});

export const categoriesReducer = categoriesSlice.reducer;
