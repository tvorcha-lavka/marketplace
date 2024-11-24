export const selectAllCategories = (state) => state.categories.items;
export const selectIsLoading = (state) => state.categories.isLoading;
export const selectError = (state) => state.categories.error;
export const selectCatalog = (state) => state.categories.catalog;
export const selectPopCategories = (state) => state.categories.popular;
export const selectCategoryById = (state) => state.categories.categoryById;
export const selectFiltersCategory = (state) => state.categories.filters;
