export const selectBasketItems = (state) => state.basket.items;

export const selectTotal = (state) => {

  return state.basket.items.reduce((total, item) => {
    const price = parseFloat(item.price);
    if (isNaN(price)) {
      console.error('Non-numeric price found:', item.price);
      return total; 
    }
    return total + price;
  }, 0);
};
