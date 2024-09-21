import { createSlice } from '@reduxjs/toolkit';
import { getAllCategories } from './categoriesOperations';

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [ ],
        error: null,
    },
    extraReducers: (builder)=> {
       
        builder.addCase(getAllCategories.fulfilled, (state, action) => {
            state.categories = action.payload;
            state.error = null;
        })
        builder.addCase(getAllCategories.rejected, (state, action) => {
            state.error = action.payload;
        })
    },
})

export const categoriesReducer = categoriesSlice.reducer;
