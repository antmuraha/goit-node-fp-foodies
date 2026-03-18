import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { referenceApi } from "../../api/endpoints/referenceApi";
import type { ApiError } from "../../shared/types/api";

type AreaItem = {
  id: number;
  name: string;
};

type AreasState = {
  list: AreaItem[];
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  listError: string | null;
};

const initialState: AreasState = {
  list: [],
  listStatus: "idle",
  listError: null,
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Unexpected areas request error";
};

export const fetchAreas = createAsyncThunk<AreaItem[], void, { rejectValue: string }>(
  "areas/fetchAreas",
  async (_, thunkApi) => {
    try {
      return await referenceApi.getAreas();
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
    }
  },
);

const areasSlice = createSlice({
  name: "areas",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAreas.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchAreas.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload ?? "Unable to load areas";
      });
  },
});

export const areasReducer = areasSlice.reducer;
