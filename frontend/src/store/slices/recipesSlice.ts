import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { recipesApi } from "../../api/endpoints/recipesApi";
import type { RecipeDetails, RecipeSearchParams, RecipeSummary } from "../../entities/recipe/types";
import type { ApiError, AsyncStatus } from "../../shared/types/api";

type RecipesState = {
  list: RecipeSummary[];
  total: number;
  limit: number;
  offset: number;
  selectedRecipe: RecipeDetails | null;
  listStatus: AsyncStatus;
  selectedRecipeStatus: AsyncStatus;
  listError: string | null;
  selectedRecipeError: string | null;
  popularList: RecipeSummary[];
  popularPage: number;
  popularLimit: number;
  popularListStatus: AsyncStatus;
  popularListError: string | null;
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
  popularList: [],
  popularPage: 0,
  popularLimit: 0,
  popularListStatus: "idle",
  popularListError: null,
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Unexpected recipes request error";
};

export const fetchRecipes = createAsyncThunk<
  { data: RecipeSummary[]; total: number; limit: number; offset: number },
  RecipeSearchParams | undefined,
  { rejectValue: string }
>("recipes/fetchRecipes", async (query, thunkApi) => {
  try {
    return await recipesApi.getRecipes(query);
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

export const fetchRecipeById = createAsyncThunk<RecipeDetails, number, { rejectValue: string }>(
  "recipes/fetchRecipeById",
  async (id, thunkApi) => {
    try {
      return await recipesApi.getRecipeById(id);
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
    }
  },
);

export const fetchPopularRecipes = createAsyncThunk<
  { data: RecipeSummary[]; total: number; limit: number; offset: number },
  void,
  { rejectValue: string }
>("recipes/fetchPopularRecipes", async (_, thunkApi) => {
  try {
    return await recipesApi.getPopularRecipes();
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

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
        state.list = action.payload.data;
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
      })
      .addCase(fetchPopularRecipes.pending, (state) => {
        state.popularListStatus = "loading";
        state.popularListError = null;
      })
      .addCase(fetchPopularRecipes.fulfilled, (state, action) => {
        state.popularListStatus = "succeeded";
        state.popularList = action.payload.data;
        state.popularPage = action.payload.offset / action.payload.limit;
        state.popularLimit = action.payload.limit;
      })
      .addCase(fetchPopularRecipes.rejected, (state, action) => {
        state.popularListStatus = "failed";
        state.popularListError = typeof action.payload === "string" ? action.payload : "Unable to load popular recipes";
      });
  },
});

export const { clearSelectedRecipe } = recipesSlice.actions;
export const recipesReducer = recipesSlice.reducer;
