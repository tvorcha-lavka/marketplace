export const selectBasketItems = (state) => state.basket.items;
export const selectCustomerData = (state) => state.basket.customerData;
export const selectDeliveryData = (state) => state.basket.deliveryData;
export const selectPaymentData = (state) => state.basket.paymentData;
export const selectDeliveryFee = (state) => state.basket.deliveryFee;
export const selectCartStep = (state) => state.basket.step;
export const selectCart = (state) => state.basket;
export const selectCachedCities = (state) => state.basket.cachedCities;
export const selectCachedBranches = (state) => state.basket.cachedBranches;
export const selectCachedPboxCities = (state) => state.basket.cachedPboxCities;
export const selectCachedPostbox = (state) => state.basket.cachedPostbox;

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
