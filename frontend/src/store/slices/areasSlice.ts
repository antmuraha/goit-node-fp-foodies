import { createPlaceholderSlice } from './createPlaceholderSlice';

const areasSlice = createPlaceholderSlice('areas');

export const areasReducer = areasSlice.reducer;
