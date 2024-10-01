import { createSlice } from '@reduxjs/toolkit';
import { getAllCategories } from './categoriesOperations';

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllCategories.pending, (state) => {
                state.loading = true;  
                state.error = null;
            })
       
        .addCase(getAllCategories.fulfilled, (state, action) => {
            state.items = action.payload;
            state.error = null;
        })
       .addCase(getAllCategories.rejected, (state, action) => {
            state.error = action.payload;
        })
    },
})

export const categoriesReducer = categoriesSlice.reducer;
