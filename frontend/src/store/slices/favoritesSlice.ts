import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { recipesApi } from "../../api/endpoints/recipesApi";
import type { ApiError } from "../../shared/types/api";
import type { RootState } from "../store";
import { clearAuthSession, fetchProfile, login, register } from "./authSlice";
import { AUTH_REQUIRED_FAVORITE_REQUEST_ERROR } from "./constants";

type FavoritesState = {
  favoriteStatusByRecipeId: Record<string, boolean>;
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

const hydrateFavoriteStatusCache = (state: FavoritesState, favoriteRecipeIds: number[]): void => {
  state.favoriteStatusByRecipeId = {};

  favoriteRecipeIds.forEach((recipeId) => {
    state.favoriteStatusByRecipeId[toRecipeKey(recipeId)] = true;
  });
};

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
      .addCase(login.fulfilled, (state, action) => {
        hydrateFavoriteStatusCache(state, action.payload.user.favoriteRecipeIds);
      })
      .addCase(register.fulfilled, (state, action) => {
        hydrateFavoriteStatusCache(state, action.payload.user.favoriteRecipeIds);
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        hydrateFavoriteStatusCache(state, action.payload.favoriteRecipeIds);
      })
      .addCase(clearAuthSession, (state) => {
        state.favoriteStatusByRecipeId = {};
        state.error = null;
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
