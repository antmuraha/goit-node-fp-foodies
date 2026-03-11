import { createPlaceholderSlice } from "./createPlaceholderSlice";

const favoritesSlice = createPlaceholderSlice("favorites");

export const favoritesReducer = favoritesSlice.reducer;
