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
  cachedCities: {},
  cachedBranches: {},
  cachedPboxCities: {},
  cachedPostbox: {},
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
      } else {
        console.error('Invalid price:', action.payload.price);
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
        ...state.deliveryData[owner], // існуючі дані seller
        ...data, // нові дані з payload
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
    cacheCityList: (state, action) => {
      const { searchTerm, cities } = action.payload;
      state.cachedCities[searchTerm] = cities;
    },
    cacheBranchList: (state, action) => {
      const { city, branches } = action.payload;
      state.cachedBranches[city] = branches;
    },
    cachePboxCityList: (state, action) => {
      const { searchTerm, city } = action.payload;
      state.cachedCities[searchTerm] = city;
    },
    cachePostboxList: (state, action) => {
      const { city, branch } = action.payload;
      state.cachedPostbox[city] = branch;
    },
    clearBasket: (state) => {
      state.items = [];
      state.customerData = { name: '', surname: '', phone: '', email: '' };
      state.deliveryData = {};
      state.paymentData = { type: '' };
      state.deliveryFee = 0;
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
  cacheCityList,
  cacheBranchList,
  cachePboxCityList,
  cachePostboxList,
} = basketSlice.actions;

export const basketReducer = basketSlice.reducer;
