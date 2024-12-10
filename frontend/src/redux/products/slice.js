import { createSlice } from '@reduxjs/toolkit';
import { getProducts, getProductsId } from './operations';

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
    loading: false,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, handlePending)
      .addCase(getProducts.fulfilled, (state, action) => {
				state.products = action.payload;
				console.log('State products', state.products);
        state.loading = false;
        state.error = false;
      })
      .addCase(getProducts.rejected, handleRejected)

      .addCase(getProductsId.pending, handlePending)
      .addCase(getProductsId.fulfilled, (state, action) => {
				state.productDetails = action.payload;
				console.log('State productDetails', state.productDetails);
        state.loading = false;
        state.error = false;
      })
      .addCase(getProductsId.rejected, handleRejected);
  },
});

export const productReducer = productSlice.reducer;
