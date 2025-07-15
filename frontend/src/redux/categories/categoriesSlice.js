import { createSlice } from '@reduxjs/toolkit';
import {
  getAllCategoriesWithPopular,
  getCategoryById,
  getCatalog,
} from './categoriesOperations';

const handlePending = (state) => {
  state.loading = true;
  state.error = false;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    catalog: [],
    catalogFlat: [],
    popular: [],
    categoryById: {},
    selectedCategoryId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCategoryId(state, action) {
      state.selectedCategoryId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategoriesWithPopular.pending, handlePending)
      .addCase(getAllCategoriesWithPopular.fulfilled, (state, action) => {
        state.items = action.payload.allCategories;
        state.popular = action.payload.popularCategories;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllCategoriesWithPopular.rejected, handleRejected)

      .addCase(getCategoryById.pending, handlePending)
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.categoryById = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getCategoryById.rejected, handleRejected)

      .addCase(getCatalog.pending, handlePending)
      .addCase(getCatalog.fulfilled, (state, action) => {
        state.catalog = action.payload.tree[0].children; 
        state.catalogFlat = action.payload.flat; 
        state.loading = false;
        state.error = null;
      })
      .addCase(getCatalog.rejected, handleRejected);
  },
});

export const { setSelectedCategoryId } = categoriesSlice.actions;

export const categoriesReducer = categoriesSlice.reducer;
