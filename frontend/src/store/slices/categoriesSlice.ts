import { createAsyncThunk } from "@reduxjs/toolkit/react";
import type { ApiError } from "../../shared/types/api";
import { categoriesApi } from "../../api/endpoints/categoriesApi";
import { createSlice } from "@reduxjs/toolkit";
import type { CategoryListResponse } from "../../entities/category/model/types";

type CategoriesState = {
  list: Array<{
    id: number;
    name: string;
    image?: string;
  }>;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  listError: string | null;
};

const initialState: CategoriesState = {
  list: [],
  listStatus: "idle",
  listError: null,
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Unexpected categories request error";
};

export const fetchCategories = createAsyncThunk<CategoryListResponse, void, { rejectValue: string }>(
  "categories/fetchCategories",
  async (_, thunkApi) => {
    try {
      return await categoriesApi.getCategories();
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
    }
  },
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = typeof action.payload === "string" ? action.payload : "Unable to load categories";
      });
  },
});

export const categoriesReducer = categoriesSlice.reducer;
