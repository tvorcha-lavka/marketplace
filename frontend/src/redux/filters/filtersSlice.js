import { createSlice } from '@reduxjs/toolkit';
import { getFiltersCategory } from './filtersOperations';

const handlePending = (state) => {
  state.loading = true;
  state.error = false;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const filterSlice = createSlice({
  name: 'filters',
  initialState: {
    filters: [],
    activeFilters: {},
    selectedFilters: [],
    loading: false,
    error: null,
  },
  reducers: {
    toggleFilter: (state, action) => {
      const { id, value } = action.payload;

      const currentFilterValues = state.activeFilters[id] || [];

      const newFilterValues = currentFilterValues.includes(value)
        ? currentFilterValues.filter((v) => v !== value)
        : [...currentFilterValues, value];

      state.activeFilters[id] = newFilterValues;

      state.selectedFilters = Object.entries(state.activeFilters).flatMap(
        ([id, values]) =>
          values.map((val) => ({
            id: id,
            value: val,
          }))
      );
    },
    removeActiveFilters: (state, action) => {
      const { id, value } = action.payload;

      if (Array.isArray(state.activeFilters[id])) {
        state.activeFilters[id] = state.activeFilters[id].filter(
          (v) => v !== value
        );
      }

      if (state.activeFilters[id]?.length === 0) {
        delete state.activeFilters[id];
      }

      state.selectedFilters = state.selectedFilters.filter(
        (f) => !(String(f.id) === String(id) && f.value === value)
      );
    },
    clearAllFilters: (state) => {
      state.activeFilters = {};
      state.selectedFilters = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFiltersCategory.pending, handlePending)
      .addCase(getFiltersCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.filters = action.payload;
      })
      .addCase(getFiltersCategory.rejected, handleRejected);
  },
});

export const {
  setFilters,
  toggleFilter,
  toggleFilterVisibility,
  removeActiveFilters,
  clearAllFilters,
} = filterSlice.actions;

export const filtersReducer = filterSlice.reducer;
