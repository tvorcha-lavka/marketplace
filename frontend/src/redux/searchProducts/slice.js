import { createSlice } from '@reduxjs/toolkit';
import { searchProducts } from './operations';

const initialState = {
  query: '',
  results: [],
  loading: false,
  error: false,
  searchHistory: [],
  full_path: [],
  full_path_ids: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
    },
    addSearchHistory: (state, action) => {
      const newItem = action.payload;

      const exists = state.searchHistory.find(
        (item) => item.id === newItem.id && item.type === newItem.type
      );

      if (!exists) {
        state.searchHistory = [newItem, ...state.searchHistory].slice(0, 3);
      }
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    saveFullPath: (state, action) => {
      state.full_path = action.payload.full_path;
      state.full_path_ids = action.payload.full_path_ids;
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
        state.results = action.payload.results;
        state.loading = false;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearSearch,
  addSearchHistory,
  clearSearchHistory,
  saveFullPath,
} = searchSlice.actions;

export const searchReducer = searchSlice.reducer;
