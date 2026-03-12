import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { recipesApi } from "../../api/endpoints/recipesApi";
import type { RecipeSearchParams, RecipeSummary } from "../../entities/recipe";
import type { ApiError, AsyncStatus } from "../../shared/types/api";

type RecipesState = {
  list: RecipeSummary[];
  total: number;
  limit: number;
  offset: number;
  selectedRecipe: RecipeSummary | null;
  listStatus: AsyncStatus;
  selectedRecipeStatus: AsyncStatus;
  listError: string | null;
  selectedRecipeError: string | null;
};

const initialState: RecipesState = {
  list: [],
  total: 0,
  limit: 0,
  offset: 0,
  selectedRecipe: null,
  listStatus: "idle",
  selectedRecipeStatus: "idle",
  listError: null,
  selectedRecipeError: null,
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Unexpected recipes request error";
};

export const fetchRecipes = createAsyncThunk<
  { recipes: RecipeSummary[]; total: number; limit: number; offset: number },
  RecipeSearchParams | undefined,
  { rejectValue: string }
>("recipes/fetchRecipes", async (query, thunkApi) => {
  try {
    return await recipesApi.getRecipes(query);
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

export const fetchRecipeById = createAsyncThunk<RecipeSummary, number, { rejectValue: string }>(
  "recipes/fetchRecipeById",
  async (id, thunkApi) => {
    try {
      return await recipesApi.getRecipeById(id);
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
    }
  },
);

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    clearSelectedRecipe: (state) => {
      state.selectedRecipe = null;
      state.selectedRecipeStatus = "idle";
      state.selectedRecipeError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload.recipes;
        state.total = action.payload.total;
        state.limit = action.payload.limit;
        state.offset = action.payload.offset;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload ?? "Unable to load recipes";
      })
      .addCase(fetchRecipeById.pending, (state) => {
        state.selectedRecipeStatus = "loading";
        state.selectedRecipeError = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.selectedRecipeStatus = "succeeded";
        state.selectedRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.selectedRecipeStatus = "failed";
        state.selectedRecipeError = action.payload ?? "Unable to load recipe";
      });
  },
});

export const { clearSelectedRecipe } = recipesSlice.actions;
export const recipesReducer = recipesSlice.reducer;
