import { createPlaceholderSlice } from "./createPlaceholderSlice";

const followersSlice = createPlaceholderSlice("followers");

export const followersReducer = followersSlice.reducer;
