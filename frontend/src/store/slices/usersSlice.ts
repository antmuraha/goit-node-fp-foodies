import { createPlaceholderSlice } from "./createPlaceholderSlice";

const usersSlice = createPlaceholderSlice("users");

export const usersReducer = usersSlice.reducer;
