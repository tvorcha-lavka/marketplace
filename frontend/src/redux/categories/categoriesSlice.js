import { createSlice } from '@reduxjs/toolkit';
import {
  getAllCategories,
  getPopCategories,
  getCategoryById,
  getCatalog,
} from './categoriesOperations';

const handlePending = (state) => {
  state.isLoading = true;
  state.error = false;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    catalog: [],
    popular: [],
    categoryById: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, handlePending)
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllCategories.rejected, handleRejected)

      .addCase(getCatalog.pending, handlePending)
      .addCase(getCatalog.fulfilled, (state, action) => {
        state.catalog = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getCatalog.rejected, handleRejected)

      .addCase(getPopCategories.pending, handlePending)
      .addCase(getPopCategories.fulfilled, (state, action) => {
        state.popular = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPopCategories.rejected, handleRejected)

      .addCase(getCategoryById.pending, handlePending)
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.categoryById = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getCategoryById.rejected, handleRejected);
  },
});

export const categoriesReducer = categoriesSlice.reducer;
