import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { referenceApi } from "../../api/endpoints/referenceApi";
import type { ApiError } from "../../shared/types/api";

type IngredientItem = {
  id: number;
  name: string;
  image: string;
};

type IngredientsState = {
  list: IngredientItem[];
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  listError: string | null;
};

const initialState: IngredientsState = {
  list: [],
  listStatus: "idle",
  listError: null,
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Unexpected ingredients request error";
};

export const fetchIngredients = createAsyncThunk<IngredientItem[], void, { rejectValue: string }>(
  "ingredients/fetchIngredients",
  async (_, thunkApi) => {
    try {
      return await referenceApi.getIngredients();
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
    }
  },
);

const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload ?? "Unable to load ingredients";
      });
  },
});

export const ingredientsReducer = ingredientsSlice.reducer;
