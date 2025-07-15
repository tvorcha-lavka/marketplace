export const selectSearchQuery = (state) => state.search.query;

export const selectSearchCategories = (state) => state.search.categories;

export const selectSearchResults = (state) => state.search.results;

export const selectSearchHistory = (state) => state.search.searchHistory;

export const selectFullPathFromRedux = (state) => state.search.full_path;

export const selectFullPathIdsFromRedux = (state) => state.search.full_path_ids;
