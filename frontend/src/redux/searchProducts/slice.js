import { createSlice } from '@reduxjs/toolkit';
import { searchProducts } from './operations';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
    searchResults: [],
    categories: [],
    searchHistory: [],
    loading: false,
    error: false,
  },
  reducers: {
    clearSearch: (state) => {
      state.query = '';
      state.searchResults = [];
      state.categories = [];
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    addSearchHistory: (state, action) => {
      const newItem = action.payload;
      if (!newItem?.id || !newItem?.title?.trim()) return;

      const filtered = state.searchHistory.filter(
        (item) => item.id !== newItem.id
      );

      state.searchHistory = [newItem, ...filtered].slice(0, 3);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.query = action.payload.query;
        state.searchResults = action.payload.products;
        state.categories = action.payload.categories;
        state.loading = false;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearch, clearSearchHistory, addSearchHistory } =
  searchSlice.actions;

export const searchReducer = searchSlice.reducer;
