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
      const { filterId, value } = action.payload;

      // Отримуємо поточний стан фільтра
      const currentFilterValues = state.activeFilters[filterId] || [];

      // Оновлюємо список активних значень
      const newFilterValues = currentFilterValues.includes(value)
        ? currentFilterValues.filter((v) => v !== value)
        : [...currentFilterValues, value];

      state.activeFilters[filterId] = newFilterValues;

      // Оновлюємо список активних фільтрів для відображення
      state.selectedFilters = Object.entries(state.activeFilters).flatMap(
        ([id, values]) =>
          values.map((val) => ({
            filterId: Number(id),
            value: val,
          }))
      );
    },
    removeFilter: (state, action) => {
      const { filterId, value } = action.payload;

      // Видаляємо значення з активних фільтрів
      state.activeFilters[filterId] = state.activeFilters[filterId]?.filter(
        (v) => v !== value
      );

      if (state.activeFilters[filterId]?.length === 0) {
        delete state.activeFilters[filterId];
      }

      // Оновлюємо список вибраних фільтрів
      state.selectedFilters = state.selectedFilters.filter(
        (f) => !(f.filterId === filterId && f.value === value)
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

export const { toggleFilter, removeFilter, clearAllFilters } =
  filterSlice.actions;
export const filtersReducer = filterSlice.reducer;
