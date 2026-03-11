import { createPlaceholderSlice } from "./createPlaceholderSlice";

const recipesSlice = createPlaceholderSlice("recipes");

export const recipesReducer = recipesSlice.reducer;
