import { createSlice } from '@reduxjs/toolkit';
import { getProducts, getProductsId, searchProducts } from './operations';

const handlePending = (state) => {
  state.loading = true;
  state.error = false;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    productDetails: null,
    totalCount: 0,
    loading: false,
    error: false,
    createSuccess: false,
    createdProduct: null,

    //SEARCH POPUP
    query: '',
    searchResults: [],
    categories: [],
    searchHistory: [],
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
      .addCase(getProducts.pending, handlePending)
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.totalCount = action.payload.count;
        state.loading = false;
        state.error = false;
      })
      .addCase(getProducts.rejected, handleRejected)

      .addCase(getProductsId.pending, handlePending)
      .addCase(getProductsId.fulfilled, (state, action) => {
        state.productDetails = action.payload;
        state.loading = false;
        state.error = false;
      })
      .addCase(getProductsId.rejected, handleRejected)

      .addCase(searchProducts.pending, handlePending)
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.query = action.payload.query;
        state.searchResults = action.payload.products;
        state.categories = action.payload.categories;
        state.loading = false;
        state.error = false;
      })
      .addCase(searchProducts.rejected, handleRejected);
  },
});

export const { clearSearch, addSearchHistory, clearSearchHistory } =
  productSlice.actions;

export const productReducer = productSlice.reducer;
