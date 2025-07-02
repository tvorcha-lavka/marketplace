export const selectProducts = (state) => state.product.products;
export const selectProductDetails = (state) => state.product.productDetails;
export const selectTotalCount = (state) => state.product.totalCount;

export const selectLoading = (state) => state.product.loading;
export const selectError = (state) => state.product.error;

export const selectSearchResults = (state) => state.product.searchResults;
export const selectSearchQuery = (state) => state.product.query;
export const selectSearchCategories = (state) => state.product.categories;
export const selectSearchHistory = (state) => state.product.searchHistory;
