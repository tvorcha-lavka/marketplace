import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
  step: 1,
  customerData: {
    name: '',
    surname: '',
    phone: '',
    email: '',
  },
  deliveryData: {},
  paymentData: {
    type: '',
  },
  deliveryFee: 0,
};

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addToBasket: (state, action) => {
      const price = parseFloat(action.payload.price);
      if (!isNaN(price)) {
        state.items.push({ ...action.payload, price });
        state.total += price;
      }
    },
    removeFromBasket: (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.total -= state.items[index].price;
        state.items.splice(index, 1);
      }
    },
    updateCustomerData: (state, action) => {
      state.customerData = { ...state.customerData, ...action.payload };
    },
    updateDeliveryData: (state, action) => {
      const [owner, data] = Object.entries(action.payload)[0];
      if (!state.deliveryData[owner]) {
        state.deliveryData[owner] = {};
      }
      state.deliveryData[owner] = {
        ...state.deliveryData[owner],
        ...data,
      };
    },
    updatePaymentData: (state, action) => {
      state.paymentData = { ...state.paymentData, ...action.payload };
    },
    setDeliveryFee: (state, action) => {
      state.deliveryFee = action.payload;
    },
    nextStep: (state) => {
      if (state.step < 3) state.step += 1;
    },
    previousStep: (state) => {
      if (state.step === 2) state.step -= 1;
      if (state.step === 3) state.step -= 2;
    },
    clearBasket: (state) => {
      state.items = [];
      state.customerData = { name: '', surname: '', phone: '', email: '' };
      state.deliveryData = {};
      state.paymentData = { type: '' };
      state.deliveryFee = 0;
    },
    resetStep(state) {
      state.step = 1;
    },
  },
});

export const {
  addToBasket,
  removeFromBasket,
  updateCustomerData,
  updateDeliveryData,
  updatePaymentData,
  setDeliveryFee,
  clearBasket,
  nextStep,
  previousStep,
  resetStep,
} = basketSlice.actions;

export const basketReducer = basketSlice.reducer;
