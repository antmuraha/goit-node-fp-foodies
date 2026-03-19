import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { recipesApi } from "../../api/endpoints/recipesApi";
import type { ApiError, AsyncStatus } from "../../shared/types/api";
import type { RootState } from "../store";
import { AUTH_REQUIRED_FAVORITE_REQUEST_ERROR } from "./constants";

type FavoritesState = {
  favoriteStatusByRecipeId: Record<string, boolean>;
  favoriteStatusRequestByRecipeId: Record<string, AsyncStatus>;
  error: string | null;
};

type FavoriteMutationPayload = {
  recipeId: number | string;
};

type FavoriteStatusPayload = {
  recipeId: number | string;
  isFavorite: boolean;
};

const initialState: FavoritesState = {
  favoriteStatusByRecipeId: {},
  favoriteStatusRequestByRecipeId: {},
  error: null,
};

const toRecipeKey = (recipeId: number | string): string => String(recipeId);

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Unexpected favorites request error";
};

const applyFavoriteStatus = (state: FavoritesState, recipeId: number | string, isFavorite: boolean): void => {
  state.favoriteStatusByRecipeId[toRecipeKey(recipeId)] = isFavorite;
};

export const fetchFavoriteStatusByRecipeId = createAsyncThunk<
  FavoriteStatusPayload,
  FavoriteMutationPayload,
  { state: RootState; rejectValue: string }
>("favorites/fetchFavoriteStatusByRecipeId", async ({ recipeId }, thunkApi) => {
  const token = thunkApi.getState().auth.token;

  if (!token) {
    return thunkApi.rejectWithValue(AUTH_REQUIRED_FAVORITE_REQUEST_ERROR);
  }

  try {
    const response = await recipesApi.getFavoriteStatus(token, recipeId);
    return { recipeId: response.recipeId, isFavorite: response.isFavorite };
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

export const addFavoriteRecipe = createAsyncThunk<
  FavoriteMutationPayload,
  FavoriteMutationPayload,
  { state: RootState; rejectValue: string }
>("favorites/addFavoriteRecipe", async ({ recipeId }, thunkApi) => {
  const token = thunkApi.getState().auth.token;

  if (!token) {
    return thunkApi.rejectWithValue(AUTH_REQUIRED_FAVORITE_REQUEST_ERROR);
  }

  try {
    await recipesApi.addFavorite(token, Number(recipeId));
    return { recipeId };
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

export const removeFavoriteRecipe = createAsyncThunk<
  FavoriteMutationPayload,
  FavoriteMutationPayload,
  { state: RootState; rejectValue: string }
>("favorites/removeFavoriteRecipe", async ({ recipeId }, thunkApi) => {
  const token = thunkApi.getState().auth.token;

  if (!token) {
    return thunkApi.rejectWithValue(AUTH_REQUIRED_FAVORITE_REQUEST_ERROR);
  }

  try {
    await recipesApi.removeFavorite(token, Number(recipeId));
    return { recipeId };
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    optimisticFavoriteStatus: (state, action: PayloadAction<FavoriteStatusPayload>) => {
      applyFavoriteStatus(state, action.payload.recipeId, action.payload.isFavorite);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteStatusByRecipeId.pending, (state, action) => {
        state.error = null;
        state.favoriteStatusRequestByRecipeId[toRecipeKey(action.meta.arg.recipeId)] = "loading";
      })
      .addCase(fetchFavoriteStatusByRecipeId.fulfilled, (state, action) => {
        state.favoriteStatusRequestByRecipeId[toRecipeKey(action.payload.recipeId)] = "succeeded";
        applyFavoriteStatus(state, action.payload.recipeId, action.payload.isFavorite);
      })
      .addCase(fetchFavoriteStatusByRecipeId.rejected, (state, action) => {
        state.favoriteStatusRequestByRecipeId[toRecipeKey(action.meta.arg.recipeId)] = "failed";
        state.error = action.payload ?? "Unable to resolve favorite status";
      })
      .addCase(addFavoriteRecipe.pending, (state) => {
        state.error = null;
      })
      .addCase(addFavoriteRecipe.fulfilled, (state, action) => {
        applyFavoriteStatus(state, action.payload.recipeId, true);
      })
      .addCase(addFavoriteRecipe.rejected, (state, action) => {
        state.error = action.payload ?? "Unable to add recipe to favorites";
      })
      .addCase(removeFavoriteRecipe.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFavoriteRecipe.fulfilled, (state, action) => {
        applyFavoriteStatus(state, action.payload.recipeId, false);
      })
      .addCase(removeFavoriteRecipe.rejected, (state, action) => {
        state.error = action.payload ?? "Unable to remove recipe from favorites";
      });
  },
});

export const { optimisticFavoriteStatus } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
