import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
  cartItems: [
    {
      id: 1,
      title: 'Українська традиційна вишиванка жінoча Львівська',
      seller: 'Lesia_OK12',
      size: 'M',
      material: 'Льон',
      condition: 'Новий',
      price: 599,
      image: 'path/to/image2.jpg',
      selected: false,
    },
    {
      id: 2,
      title: 'Українська традиційна вишиванка жінoча Львівська',
      seller: 'Lesia_OK12',
      size: 'M',
      material: 'Льон',
      condition: 'Новий',
      price: 299,
      image: 'path/to/image2.jpg',
      selected: false,
    },
    {
      id: 3,
      title: 'Українська традиційна вишиванка жінoча Львівська',
      seller: 'Nikita_OK14',
      size: 'M',
      material: 'Льон',
      condition: 'Новий',
      price: 500,
      image: 'path/to/image3.jpg',
      selected: false,
    },
    {
      id: 4,
      title: 'Українська традиційна вишиванка жінoча Львівська',
      seller: 'Dan_OK15',
      size: 'M',
      material: 'Льон',
      condition: 'Новий',
      price: 899,
      image: 'path/to/image4.jpg',
      selected: false,
    },
  ],
  selectedItems: [],
  totalPayment: 0,
  deliveryFee: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action) {
      state.cartItems = action.payload;
    },
    toggleSelectItem(state, action) {
      const itemId = action.payload;
      state.cartItems = state.cartItems.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      );
      state.selectedItems = state.cartItems.filter((item) => item.selected);
      state.totalPayment = state.selectedItems.reduce(
        (sum, item) => sum + item.price,
        0
      );
    },
    toggleSelectAll(state, action) {
      const selectAll = action.payload;
      state.cartItems.forEach((item) => {
        item.selected = selectAll;
      });
      state.selectedItems = selectAll ? [...state.cartItems] : [];
      state.totalPayment = selectAll
        ? state.cartItems.reduce((sum, item) => sum + item.price, 0)
        : 0;
    },
    removeItem(state, action) {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
      state.selectedItems = state.cartItems.filter((item) => item.selected);
      state.totalPayment = state.selectedItems.reduce(
        (sum, item) => sum + item.price,
        0
      );
    },
    updateCustomerData: (state, action) => {
      state.customerData = { ...state.customerData, ...action.payload };
    },
    updateDeliveryData: (state, action) => {
      const [seller, data] = Object.entries(action.payload)[0];
      if (!state.deliveryData[seller]) {
        state.deliveryData[seller] = {};
      }
      state.deliveryData[seller] = { ...state.deliveryData[seller], ...data };
    },
    updatePaymentData: (state, action) => {
      state.paymentData = { ...state.paymentData, ...action.payload };
    },
    nextStep: (state) => {
      if (state.step < 3) state.step += 1;
    },
    previousStep: (state) => {
      if (state.step === 2) state.step -= 1;
      if (state.step === 3) state.step -= 2;
    },
    updateCartItems: (state, action) => {
      state.cartItems = { ...state.cartItems, ...action.payload };
    },
    setDeliveryFee(state, action) {
      state.deliveryFee = action.payload;
    },
    // submitOrder: (state, action) => {
    //   // Можна відправити дані на бекенд тут
    // },
  },
});

export const {
  setCartItems,
  toggleSelectItem,
  toggleSelectAll,
  removeItem,
  updateCustomerData,
  updateDeliveryData,
  updatePaymentData,
  nextStep,
  previousStep,
  updateCartItems,
  setDeliveryFee,
  submitOrder,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
