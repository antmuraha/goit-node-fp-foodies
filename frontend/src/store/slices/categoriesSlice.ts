import { createPlaceholderSlice } from "./createPlaceholderSlice";

const categoriesSlice = createPlaceholderSlice("categories");

export const categoriesReducer = categoriesSlice.reducer;
