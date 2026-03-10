import { createPlaceholderSlice } from './createPlaceholderSlice';

const ingredientsSlice = createPlaceholderSlice('ingredients');

export const ingredientsReducer = ingredientsSlice.reducer;
