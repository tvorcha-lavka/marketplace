import { createSlice } from '@reduxjs/toolkit';

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    cards: [],
    mainCardIndex: null,
  },
  reducers: {
    setCards(state, action) {
      state.cards = action.payload;
    },
    addCard(state, action) {
      state.cards.push(action.payload);
    },
    deleteCard(state, action) {
      state.cards = state.cards.filter((_, i) => i !== action.payload);
    },
    setMainCardIndex(state, action) {
      state.mainCardIndex = action.payload;
    },
    toggleShowHidden(state, action) {
      const card = state.cards[action.payload];
      if (card) {
        card.showHiddenDigits = !card.showHiddenDigits;
      }
    },
  },
});

export const {
  setCards,
  addCard,
  deleteCard,
  setMainCardIndex,
  toggleShowHidden,
} = paymentSlice.actions;

export const paymentReducer = paymentSlice.reducer;
