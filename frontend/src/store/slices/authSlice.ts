import { createPlaceholderSlice } from "./createPlaceholderSlice";

const authSlice = createPlaceholderSlice("auth");

export const authReducer = authSlice.reducer;
