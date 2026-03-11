import { createSlice } from "@reduxjs/toolkit";

export const createPlaceholderSlice = (name: string) => {
  return createSlice({
    name,
    initialState: {},
    reducers: {},
  });
};
