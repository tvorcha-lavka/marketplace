import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: 1,
  customerData: {
    name: '',
    surname: '',
    phone: '',
    email: '',
  },
  deliveryData: {
    type: '',
    city: '',
    branch: '',
    address: '',
  },
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
      seller: 'Oksana_OK13',
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
      state.deliveryData = { ...state.deliveryData, ...action.payload };
    },
    updatePaymentData: (state, action) => {
      state.paymentData = { ...state.paymentData, ...action.payload };
    },
    nextStep: (state) => {
      if (state.step < 3) state.step += 1;
    },
    previousStep: (state) => {
      if (state.step > 1) state.step -= 1;
    },
    updateCartItems: (state, action) => {
      state.cartItems = { ...state.cartItems, ...action.payload };
    },
    // submitOrder: (state, action) => {
    //   // Можна відправити дані на бекенд тут
    // },
  },
});

export const {
  setCartItems,
  toggleSelectItem,
  removeItem,
  updateCustomerData,
  updateDeliveryData,
  updatePaymentData,
  nextStep,
  previousStep,
  updateCartItems,
  submitOrder,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
