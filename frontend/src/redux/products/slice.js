import { createSlice } from '@reduxjs/toolkit';
import { getProducts, getProductsId, createProduct } from './operations';

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

      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.createSuccess = false;
        state.createdProduct = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        state.createdProduct = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.createSuccess = false;
      });
  },
});

export const productReducer = productSlice.reducer;
