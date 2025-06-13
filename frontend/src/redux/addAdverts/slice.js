import { createSlice } from '@reduxjs/toolkit';
import { createProduct } from './operations';

const initialState = {
  selectedCategory: null,
  selectedSubCategory: null,
  selectedChildCategory: null,
  selectedFilters: {},
  selectedColors: [],
  isSelectedDelivery: [],
  isCategoryConfirmed: false,
  title: '',
  description: '',
  price: '',
  loading: false,
  error: false,
  createSuccess: false,
  createdProduct: null,
};

const advertSlice = createSlice({
  name: 'advert',
  initialState,
  reducers: {
    setField: (state, action) => {
      state[action.payload.field] = action.payload.value;
    },
    setIsCategoryConfirmed: (state, action) => {
      state.isCategoryConfirmed = action.payload;
    },
    resetAdvert: () => initialState,
  },
  extraReducers: (builder) => {
    builder
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

export const { setField, resetAdvert, setIsCategoryConfirmed } = advertSlice.actions;

export const advertReducer = advertSlice.reducer;
