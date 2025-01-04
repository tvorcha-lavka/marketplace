import { createSlice } from '@reduxjs/toolkit';
import {
  getAllCategoriesWithPopular,
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
        state.error = null;
      })

      .addCase(getCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPopCategories.rejected, handleRejected)

      .addCase(getCategoryById.pending, handlePending)
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
