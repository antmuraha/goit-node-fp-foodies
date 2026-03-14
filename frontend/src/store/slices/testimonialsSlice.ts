import { createAsyncThunk } from "@reduxjs/toolkit/react";
import type { ApiError } from "../../shared/types/api";
import { createSlice } from "@reduxjs/toolkit";
import { testimonialApi } from "../../api/endpoints/testimonialApi";
import type { TestimonialListResponse, TestimonialSummary } from "../../entities/testimonial/model/types";

type TestimonialState = {
  list: TestimonialSummary[];
  limit: number;
  page: number;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  listError: string | null;
};

const initialState: TestimonialState = {
  list: [],
  limit: 0,
  page: 0,
  listStatus: "idle",
  listError: null,
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Unexpected testimonials request error";
};

export const fetchTestimonials = createAsyncThunk<TestimonialListResponse, void, { rejectValue: string }>(
  "testimonials/fetchTestimonials",
  async (_, thunkApi) => {
    try {
      return await testimonialApi.getTestimonials();
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
    }
  },
);

const testimonialsSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload.data;
        state.limit = action.payload.limit;
        state.page = action.payload.page;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = typeof action.payload === "string" ? action.payload : "Unable to load testimonials";
      });
  },
});

export const testimonialsReducer = testimonialsSlice.reducer;
