export const selectCartStep = (state) => state.cart.step;
export const selectCartItems = (state) => state.cart.cartItems;

export const selectTotal = (state) => {
  return state.cart.cartItems.reduce((total, item) => {
    if (isNaN(item.price)) {
      console.error('Non-numeric price found:', item.price);
      return total;
    }
    return total + item.price;
  }, 0);
};
