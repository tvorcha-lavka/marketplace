import { createSlice } from '@reduxjs/toolkit';

const basketSlice = createSlice({
  name: 'basket',
  initialState: {
    items: [],
    total: 0,
  },
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
  },
});

export const { addToBasket, removeFromBasket } = basketSlice.actions;

export default basketSlice.reducer;
